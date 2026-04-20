import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Collection } from '../entities/collection.entity';
import { ReturnBookDto } from '@/books/dto/return-book.dto';

export class ReturnCollectionDto {
  @ApiProperty({ description: 'Collection UUID', example: 'uuid-v4' })
  id: string;

  @ApiProperty({ description: 'Collection name', example: 'My Favorites' })
  name: string;

  @ApiProperty({ description: 'Owner user UUID' })
  userId: string;

  @ApiPropertyOptional({
    description: 'Books in this collection',
    type: [ReturnBookDto],
  })
  books?: ReturnBookDto[];

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  constructor(collection: Collection) {
    this.id = collection.id;
    this.name = collection.name;
    this.userId = collection.userId;
    this.books = collection.books
      ? collection.books.map((b) => new ReturnBookDto(b))
      : undefined;
    this.createdAt = collection.createdAt;
    this.updatedAt = collection.updatedAt;
  }
}
