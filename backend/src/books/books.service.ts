import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Book } from './entities/book.entity';
import { Author } from '@/authors/entities/author.entity';
import { Category } from '@/categories/entities/category.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { OpenLibraryService } from './openlibrary.service';
import { SearchService, BookPreview } from '@/search/search.service';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly openLibraryService: OpenLibraryService,
    private readonly searchService: SearchService,
    @InjectQueue('book-indexing') private readonly bookIndexingQueue: Queue,
  ) {}

  /** Find a book by UUID. Returns null if not found. */
  async findById(id: string): Promise<Book | null> {
    return this.bookRepository.findOne({
      where: { id },
      relations: ['author', 'categories'],
    });
  }

  /**
   * Find a book by ISBN.
   * If not cached, fetches from OpenLibrary, persists book+author+categories.
   */
  async findByIsbn(isbn: string): Promise<Book | null> {
    const existing = await this.bookRepository.findOne({
      where: { isbn },
      relations: ['author', 'categories'],
    });

    if (existing) {
      return existing;
    }

    const data = await this.openLibraryService.fetchByIsbn(isbn);
    if (!data) {
      return null;
    }

    // Upsert author
    let author: Author | null = null;
    if (data.author) {
      const existingAuthor = await this.authorRepository.findOne({
        where: { name: data.author.name },
      });
      if (existingAuthor) {
        author = existingAuthor;
      } else {
        author = this.authorRepository.create({
          name: data.author.name,
          pageUrl: data.author.pageUrl ?? undefined,
        });
        author = await this.authorRepository.save(author);
      }
    }

    // Upsert categories
    const categories: Category[] = [];
    for (const catName of data.categories) {
      if (!catName) continue;
      let cat = await this.categoryRepository.findOne({
        where: { name: catName },
      });
      if (!cat) {
        cat = this.categoryRepository.create({ name: catName });
        cat = await this.categoryRepository.save(cat);
      }
      categories.push(cat);
    }

    const book = this.bookRepository.create({
      title: data.title,
      coverUrl: data.coverUrl ?? undefined,
      synopsis: data.synopsis ?? undefined,
      pages: data.pages ?? undefined,
      publishedDate: data.publishedDate
        ? new Date(data.publishedDate)
        : undefined,
      publisher: data.publisher ?? undefined,
      isbn: data.isbn ?? isbn,
      siteUrl: data.siteUrl ?? undefined,
      openLibraryId: data.openLibraryId ?? undefined,
      authorId: author?.id,
      categories,
    });

    const saved = await this.bookRepository.save(book);
    if (author) saved.author = author;
    saved.categories = categories;

    // Enqueue async indexing
    const preview: BookPreview = {
      id: saved.id,
      title: saved.title,
      authorName: author?.name ?? '',
      coverUrl: saved.coverUrl ?? undefined,
      siteUrl: saved.siteUrl ?? undefined,
    };
    await this.bookIndexingQueue
      .add(preview)
      .catch((err: Error) =>
        this.logger.warn(`Failed to enqueue book indexing: ${err.message}`),
      );

    return saved;
  }

  /**
   * Find a book by OpenLibrary work ID (e.g. "OL123W", without the /works/ prefix).
   * If not cached, fetches from OpenLibrary, persists and indexes the book.
   */
  async findByOpenLibraryId(workId: string): Promise<Book | null> {
    const openLibraryId = `/works/${workId}`;

    const existing = await this.bookRepository.findOne({
      where: { openLibraryId },
      relations: ['author', 'categories'],
    });
    if (existing) {
      return existing;
    }

    const data = await this.openLibraryService.fetchById(openLibraryId);
    if (!data) {
      return null;
    }

    // Upsert author
    let author: Author | null = null;
    if (data.author) {
      const existingAuthor = await this.authorRepository.findOne({
        where: { name: data.author.name },
      });
      author = existingAuthor
        ? existingAuthor
        : await this.authorRepository.save(
            this.authorRepository.create({
              name: data.author.name,
              pageUrl: data.author.pageUrl ?? undefined,
            }),
          );
    }

    // Upsert categories
    const categories: Category[] = [];
    for (const catName of data.categories) {
      if (!catName) continue;
      let cat = await this.categoryRepository.findOne({
        where: { name: catName },
      });
      if (!cat) {
        cat = await this.categoryRepository.save(
          this.categoryRepository.create({ name: catName }),
        );
      }
      categories.push(cat);
    }

    const book = this.bookRepository.create({
      title: data.title,
      coverUrl: data.coverUrl ?? undefined,
      synopsis: data.synopsis ?? undefined,
      pages: data.pages ?? undefined,
      publishedDate: data.publishedDate
        ? new Date(data.publishedDate)
        : undefined,
      publisher: data.publisher ?? undefined,
      isbn: data.isbn ?? undefined,
      siteUrl: data.siteUrl ?? undefined,
      openLibraryId: data.openLibraryId ?? openLibraryId,
      authorId: author?.id,
      categories,
    });

    const saved = await this.bookRepository.save(book);
    if (author) saved.author = author;
    saved.categories = categories;

    const preview: BookPreview = {
      id: saved.id,
      title: saved.title,
      authorName: author?.name ?? '',
      coverUrl: saved.coverUrl ?? undefined,
      siteUrl: saved.siteUrl ?? undefined,
    };
    await this.bookIndexingQueue
      .add(preview)
      .catch((err: Error) =>
        this.logger.warn(`Failed to enqueue book indexing: ${err.message}`),
      );

    return saved;
  }

  /** Find popular books ordered by viewCount DESC. */
  async findPopular(limit = 10): Promise<Book[]> {
    return this.bookRepository.find({
      order: { viewCount: 'DESC' },
      take: limit,
      relations: ['author', 'categories'],
    });
  }

  /** Find books by category, ordered by average stars DESC. */
  async findByCategory(categoryId: string): Promise<Book[]> {
    return this.bookRepository
      .createQueryBuilder('book')
      .innerJoin('book.categories', 'category', 'category.id = :categoryId', {
        categoryId,
      })
      .leftJoinAndSelect('book.author', 'author')
      .leftJoinAndSelect('book.categories', 'allCategories')
      .leftJoin('review', 'review', 'review."bookId" = book.id')
      .addSelect('COALESCE(AVG(review.stars), 0)', 'avgStars')
      .groupBy('book.id')
      .addGroupBy('author.id')
      .addGroupBy('allCategories.id')
      .orderBy('avgStars', 'DESC')
      .getMany();
  }

  /** Find books by author UUID. */
  async findByAuthor(authorId: string): Promise<Book[]> {
    return this.bookRepository.find({
      where: { authorId },
      relations: ['author', 'categories'],
    });
  }

  /** Increment viewCount atomically using a query builder. */
  async incrementViewCount(bookId: string): Promise<void> {
    await this.bookRepository
      .createQueryBuilder()
      .update(Book)
      .set({ viewCount: () => '"viewCount" + 1' })
      .where('id = :id', { id: bookId })
      .execute();
  }

  /** Create a new book. */
  async create(dto: CreateBookDto): Promise<Book> {
    const book = this.bookRepository.create(dto as Partial<Book>);
    const saved = await this.bookRepository.save(book);

    // Enqueue async indexing
    const authorEntity = saved.authorId
      ? await this.authorRepository.findOne({
          where: { id: saved.authorId },
        })
      : null;

    const preview: BookPreview = {
      id: saved.id,
      title: saved.title,
      authorName: authorEntity?.name ?? '',
      coverUrl: saved.coverUrl ?? undefined,
      siteUrl: saved.siteUrl ?? undefined,
    };
    await this.bookIndexingQueue
      .add(preview)
      .catch((err: Error) =>
        this.logger.warn(`Failed to enqueue book indexing: ${err.message}`),
      );

    return saved;
  }

  /** Update an existing book. */
  async update(id: string, dto: UpdateBookDto): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    Object.assign(book, dto);
    return this.bookRepository.save(book);
  }

  /** Remove a book. */
  async remove(id: string): Promise<void> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    await this.bookRepository.remove(book);
    await this.searchService
      .deleteBook(id)
      .catch((err: Error) =>
        this.logger.warn(
          `Failed to delete book from search index: ${err.message}`,
        ),
      );
  }

  /** Full-text search via Elasticsearch, with fallback to OpenLibrary. */
  async search(query: string): Promise<BookPreview[]> {
    /*
    const local = await this.searchService.searchBooks(query);
    if (local.length > 0) {
      return local;
    }
*/
    const olResults = await this.openLibraryService.searchByTitle(query);
    return olResults.map((b) => {
      const workId = b.openLibraryId?.replace(/^\/works\//, '') ?? undefined;
      return {
        id: workId ?? b.isbn ?? '',
        title: b.title,
        authorName: b.author?.name ?? '',
        coverUrl: b.coverUrl ?? undefined,
        siteUrl: b.siteUrl ?? undefined,
        isbn: b.isbn ?? undefined,
        openLibraryId: workId,
      };
    });
  }
}
