import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Book } from '../entities/book.entity';
import { ReturnAuthorDto } from '@/authors/dto/return-author.dto';
import { ReturnCategoryDto } from '@/categories/dto/return-category.dto';

export class ReturnBookDto {
  @ApiProperty({ description: 'Book UUID', example: 'uuid-v4' })
  id: string;

  @ApiProperty({ description: 'Book title', example: 'The Hobbit' })
  title: string;

  @ApiPropertyOptional({ description: 'Book cover image URL', nullable: true })
  coverUrl: string | null;

  @ApiPropertyOptional({ description: 'Book synopsis', nullable: true })
  synopsis: string | null;

  @ApiPropertyOptional({ description: 'Number of pages', nullable: true })
  pages: number | null;

  @ApiPropertyOptional({ description: 'Published date', nullable: true })
  publishedDate: Date | null;

  @ApiPropertyOptional({ description: 'Publisher name', nullable: true })
  publisher: string | null;

  @ApiPropertyOptional({ description: 'ISBN identifier', nullable: true })
  isbn: string | null;

  @ApiPropertyOptional({ description: 'Book page URL', nullable: true })
  siteUrl: string | null;

  @ApiPropertyOptional({ description: 'OpenLibrary work ID', nullable: true })
  openLibraryId: string | null;

  @ApiProperty({ description: 'Number of views', default: 0 })
  viewCount: number;

  @ApiPropertyOptional({
    description: 'Author details',
    type: ReturnAuthorDto,
    nullable: true,
  })
  author: ReturnAuthorDto | null;

  @ApiProperty({ description: 'Book categories', type: [ReturnCategoryDto] })
  categories: ReturnCategoryDto[];

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  constructor(book: Book) {
    this.id = book.id;
    this.title = book.title;
    this.coverUrl = book.coverUrl ?? null;
    this.synopsis = book.synopsis ?? null;
    this.pages = book.pages ?? null;
    this.publishedDate = book.publishedDate ?? null;
    this.publisher = book.publisher ?? null;
    this.isbn = book.isbn ?? null;
    this.siteUrl = book.siteUrl ?? null;
    this.openLibraryId = book.openLibraryId ?? null;
    this.viewCount = book.viewCount ?? 0;
    this.author = book.author ? new ReturnAuthorDto(book.author) : null;
    this.categories = book.categories
      ? book.categories.map((c) => new ReturnCategoryDto(c))
      : [];
    this.createdAt = book.createdAt;
    this.updatedAt = book.updatedAt;
  }
}
