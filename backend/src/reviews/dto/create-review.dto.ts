import { IsString, IsOptional, IsInt, Min, Max, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'Book UUID to review', example: 'uuid-v4' })
  @IsUUID()
  bookId: string;

  @ApiProperty({
    description: 'Star rating 1-5',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  stars: number;

  @ApiPropertyOptional({
    description: 'Optional text review',
    example: 'Great book, highly recommend!',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
