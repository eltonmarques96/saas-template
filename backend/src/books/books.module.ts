import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Book } from './entities/book.entity';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { OpenLibraryService } from './openlibrary.service';
import { AuthorsModule } from '@/authors/authors.module';
import { CategoriesModule } from '@/categories/categories.module';
import { SearchModule } from '@/search/search.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    HttpModule,
    AuthorsModule,
    CategoriesModule,
    SearchModule,
    BullModule.registerQueue({
      name: 'book-indexing',
    }),
  ],
  controllers: [BooksController],
  providers: [BooksService, OpenLibraryService],
  exports: [TypeOrmModule, BooksService],
})
export class BooksModule {}
