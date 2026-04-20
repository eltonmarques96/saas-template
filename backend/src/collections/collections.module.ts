import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { BooksModule } from '@/books/books.module';

@Module({
  imports: [TypeOrmModule.forFeature([Collection]), BooksModule],
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [CollectionsService],
})
export class CollectionsModule {}
