import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReturnReviewDto, ReturnReviewListDto } from './dto/return-review.dto';
import { Public } from '@/metadata';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Public()
  @Get('book/:bookId')
  @ApiOperation({
    summary: 'Get all reviews for a book (includes average stars)',
  })
  @ApiParam({ name: 'bookId', description: 'Book UUID' })
  @ApiResponse({
    status: 200,
    description: 'Review list with average stars',
    type: ReturnReviewListDto,
  })
  async findByBook(
    @Param('bookId', ParseUUIDPipe) bookId: string,
  ): Promise<ReturnReviewListDto> {
    const reviews = await this.reviewsService.findByBook(bookId);
    return new ReturnReviewListDto(reviews);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a review (one per user per book)' })
  @ApiResponse({
    status: 201,
    description: 'Review created',
    type: ReturnReviewDto,
  })
  @ApiResponse({ status: 409, description: 'User already reviewed this book' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() dto: CreateReviewDto,
    @Request() req,
  ): Promise<ReturnReviewDto> {
    const userId: string = req.user?.sub ?? req.user?.id;
    const review = await this.reviewsService.create(dto, userId);
    return new ReturnReviewDto(review);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update your review' })
  @ApiParam({ name: 'id', description: 'Review UUID' })
  @ApiResponse({
    status: 200,
    description: 'Review updated',
    type: ReturnReviewDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not your review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateReviewDto,
    @Request() req,
  ): Promise<ReturnReviewDto> {
    const userId: string = req.user?.sub ?? req.user?.id;
    const review = await this.reviewsService.update(id, dto, userId);
    return new ReturnReviewDto(review);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete your review' })
  @ApiParam({ name: 'id', description: 'Review UUID' })
  @ApiResponse({ status: 200, description: 'Review deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<{ message: string }> {
    const userId: string = req.user?.sub ?? req.user?.id;
    await this.reviewsService.remove(id, userId);
    return { message: 'Review deleted successfully' };
  }
}
