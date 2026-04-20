import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { Book } from '@/books/entities/book.entity';
import { User } from '@/users/entities/user.entity';
import { Review } from '@/reviews/entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, User, Review])],
  controllers: [AdminController],
})
export class AdminModule {}
