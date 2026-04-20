import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from './entities/collection.entity';
import { Book } from '@/books/entities/book.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  /** Find all collections owned by a user (with books relation). */
  async findAllByUser(userId: string): Promise<Collection[]> {
    return this.collectionRepository.find({
      where: { userId },
      relations: ['books', 'books.author', 'books.categories'],
    });
  }

  /**
   * Find one collection by id.
   * Throws NotFoundException if not found.
   * Throws ForbiddenException if userId doesn't match owner.
   */
  async findOne(id: string, userId: string): Promise<Collection> {
    const collection = await this.collectionRepository.findOne({
      where: { id },
      relations: ['books', 'books.author', 'books.categories'],
    });

    if (!collection) {
      throw new NotFoundException(`Collection with id ${id} not found`);
    }

    if (collection.userId !== userId) {
      throw new ForbiddenException('You do not have access to this collection');
    }

    return collection;
  }

  /** Create a new collection for the authenticated user. */
  async create(dto: CreateCollectionDto, userId: string): Promise<Collection> {
    const collection = this.collectionRepository.create({
      name: dto.name,
      userId,
      books: [],
    });
    return this.collectionRepository.save(collection);
  }

  /** Update a collection name (ownership enforced). */
  async update(
    id: string,
    dto: UpdateCollectionDto,
    userId: string,
  ): Promise<Collection> {
    const collection = await this.findOne(id, userId);
    if (dto.name !== undefined) {
      collection.name = dto.name;
    }
    return this.collectionRepository.save(collection);
  }

  /** Remove a collection (ownership enforced). */
  async remove(id: string, userId: string): Promise<void> {
    const collection = await this.findOne(id, userId);
    await this.collectionRepository.remove(collection);
  }

  /** Add a book to a collection (ownership enforced). */
  async addBook(
    collectionId: string,
    bookId: string,
    userId: string,
  ): Promise<Collection> {
    const collection = await this.findOne(collectionId, userId);

    const book = await this.bookRepository.findOne({
      where: { id: bookId },
      relations: ['author', 'categories'],
    });
    if (!book) {
      throw new NotFoundException(`Book with id ${bookId} not found`);
    }

    const alreadyAdded = collection.books?.some((b) => b.id === bookId);
    if (!alreadyAdded) {
      collection.books = [...(collection.books ?? []), book];
      await this.collectionRepository.save(collection);
    }

    return collection;
  }

  /** Remove a book from a collection (ownership enforced). */
  async removeBook(
    collectionId: string,
    bookId: string,
    userId: string,
  ): Promise<Collection> {
    const collection = await this.findOne(collectionId, userId);
    collection.books = (collection.books ?? []).filter((b) => b.id !== bookId);
    return this.collectionRepository.save(collection);
  }
}
