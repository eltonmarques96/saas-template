import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../entities/category.entity';

export class ReturnCategoryDto {
  @ApiProperty({ description: 'Category UUID', example: 'uuid-v4' })
  id: string;

  @ApiProperty({ description: 'Category name', example: 'Fantasy' })
  name: string;

  @ApiProperty({ description: 'OpenLibrary subject page URL', nullable: true })
  pageUrl: string | null;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.pageUrl = category.pageUrl ?? null;
    this.createdAt = category.createdAt;
  }
}
