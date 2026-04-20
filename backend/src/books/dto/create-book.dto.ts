import {
  IsString,
  IsOptional,
  IsInt,
  IsPositive,
  IsDateString,
  IsUUID,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ description: 'Book title (required)', example: 'The Hobbit' })
  @IsString()
  title: string;

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

  @ApiPropertyOptional({
    description: 'Publisher name',
    example: 'Allen & Unwin',
  })
  @IsOptional()
  @IsString()
  publisher?: string;

  @ApiPropertyOptional({
    description: 'ISBN identifier',
    example: '9780547928227',
  })
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiPropertyOptional({ description: 'Book page URL (e.g. OpenLibrary)' })
  @IsOptional()
  @IsUrl()
  siteUrl?: string;

  @ApiPropertyOptional({
    description: 'OpenLibrary work ID',
    example: '/works/OL262758W',
  })
  @IsOptional()
  @IsString()
  openLibraryId?: string;

  @ApiProperty({ description: 'Author UUID (required)', example: 'uuid-v4' })
  @IsUUID()
  authorId: string;
}
