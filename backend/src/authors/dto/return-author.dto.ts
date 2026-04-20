import { ApiProperty } from '@nestjs/swagger';
import { Author } from '../entities/author.entity';

export class ReturnAuthorDto {
  @ApiProperty({ description: 'Author UUID', example: 'uuid-v4' })
  id: string;

  @ApiProperty({ description: 'Author full name', example: 'J.R.R. Tolkien' })
  name: string;

  @ApiProperty({
    description: 'OpenLibrary author page URL',
    nullable: true,
  })
  pageUrl: string | null;

  @ApiProperty({ description: 'Author photo URL', nullable: true })
  photoUrl: string | null;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  constructor(author: Author) {
    this.id = author.id;
    this.name = author.name;
    this.pageUrl = author.pageUrl ?? null;
    this.photoUrl = author.photoUrl ?? null;
    this.createdAt = author.createdAt;
    this.updatedAt = author.updatedAt;
  }
}
