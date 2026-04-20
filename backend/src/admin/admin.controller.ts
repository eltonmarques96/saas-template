import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '@/books/entities/book.entity';
import { User } from '@/users/entities/user.entity';
import { Review } from '@/reviews/entities/review.entity';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get admin statistics (requires JWT)' })
  @ApiResponse({
    status: 200,
    description: 'Admin statistics',
    schema: {
      type: 'object',
      properties: {
        totalBooks: { type: 'number' },
        totalUsers: { type: 'number' },
        totalReviews: { type: 'number' },
        topBook: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            viewCount: { type: 'number' },
          },
          nullable: true,
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getStats(): Promise<{
    totalBooks: number;
    totalUsers: number;
    totalReviews: number;
    topBook: { id: string; title: string; viewCount: number } | null;
  }> {
    const [totalBooks, totalUsers, totalReviews] = await Promise.all([
      this.bookRepository.count(),
      this.userRepository.count(),
      this.reviewRepository.count(),
    ]);

    const topBook = await this.bookRepository.findOne({
      order: { viewCount: 'DESC' },
      select: ['id', 'title', 'viewCount'],
    });

    return {
      totalBooks,
      totalUsers,
      totalReviews,
      topBook: topBook
        ? { id: topBook.id, title: topBook.title, viewCount: topBook.viewCount }
        : null,
    };
  }
}
