import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Review } from '../entities/review.entity';

export class ReturnReviewDto {
  @ApiProperty({ description: 'Review UUID', example: 'uuid-v4' })
  id: string;

  @ApiProperty({ description: 'Book UUID' })
  bookId: string;

  @ApiProperty({ description: 'Reviewer user UUID' })
  userId: string;

  @ApiProperty({ description: 'Star rating 1-5', minimum: 1, maximum: 5 })
  stars: number;

  @ApiPropertyOptional({ description: 'Text comment', nullable: true })
  comment: string | null;

  @ApiPropertyOptional({
    description: 'Reviewer first and last name',
    nullable: true,
  })
  userName?: string | null;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  constructor(review: Review) {
    this.id = review.id;
    this.bookId = review.bookId;
    this.userId = review.userId;
    this.stars = review.stars;
    this.comment = review.comment ?? null;
    this.createdAt = review.createdAt;
    this.updatedAt = review.updatedAt;

    if (review.user) {
      this.userName = `${review.user.firstName} ${review.user.lastName}`;
    }
  }
}

export class ReturnReviewListDto {
  @ApiProperty({ description: 'List of reviews', type: [ReturnReviewDto] })
  reviews: ReturnReviewDto[];

  @ApiProperty({
    description: 'Average star rating for this book',
    example: 4.2,
  })
  averageStars: number;

  constructor(reviews: Review[]) {
    this.reviews = reviews.map((r) => new ReturnReviewDto(r));
    this.averageStars =
      reviews.length > 0
        ? Math.round(
            (reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length) *
              10,
          ) / 10
        : 0;
  }
}
