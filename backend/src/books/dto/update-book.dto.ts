import {
  IsString,
  IsOptional,
  IsInt,
  IsPositive,
  IsDateString,
  IsUUID,
  IsUrl,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBookDto {
  @ApiPropertyOptional({ description: 'Book title', example: 'The Hobbit' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Book cover image URL' })
  @IsOptional()
  @IsUrl()
  coverUrl?: string;

  @ApiPropertyOptional({ description: 'Book synopsis / description' })
  @IsOptional()
  @IsString()
  synopsis?: string;

  @ApiPropertyOptional({ description: 'Number of pages', example: 310 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  pages?: number;

  @ApiPropertyOptional({
    description: 'Published date (ISO 8601)',
    example: '1937-09-21',
  })
  @IsOptional()
  @IsDateString()
  publishedDate?: string;

  @ApiPropertyOptional({ description: 'Publisher name' })
  @IsOptional()
  @IsString()
  publisher?: string;

  @ApiPropertyOptional({ description: 'ISBN identifier' })
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiPropertyOptional({ description: 'Book page URL' })
  @IsOptional()
  @IsUrl()
  siteUrl?: string;

  @ApiPropertyOptional({ description: 'OpenLibrary work ID' })
  @IsOptional()
  @IsString()
  openLibraryId?: string;

  @ApiPropertyOptional({ description: 'Author UUID' })
  @IsOptional()
  @IsUUID()
  authorId?: string;
}
