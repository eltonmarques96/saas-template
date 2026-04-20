import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  /** Find all reviews for a book (includes user relation). */
  async findByBook(bookId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { bookId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Create a review.
   * Throws ConflictException if user already reviewed this book.
   */
  async create(dto: CreateReviewDto, userId: string): Promise<Review> {
    const existing = await this.reviewRepository.findOne({
      where: { userId, bookId: dto.bookId },
    });

    if (existing) {
      throw new ConflictException('User already reviewed this book');
    }

    const review = this.reviewRepository.create({
      ...dto,
      userId,
    });

    return this.reviewRepository.save(review);
  }

  /**
   * Update a review.
   * Throws NotFoundException if not found.
   * Throws ForbiddenException if userId doesn't match.
   */
  async update(
    id: string,
    dto: UpdateReviewDto,
    userId: string,
  ): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    Object.assign(review, dto);
    return this.reviewRepository.save(review);
  }

  /**
   * Remove a review.
   * Throws NotFoundException if not found.
   * Throws ForbiddenException if userId doesn't match.
   */
  async remove(id: string, userId: string): Promise<void> {
    const review = await this.reviewRepository.findOne({ where: { id } });

    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.reviewRepository.remove(review);
  }
}
