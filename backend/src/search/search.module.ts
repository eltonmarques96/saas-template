import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { SearchService } from './search.service';
import { BookIndexingProcessor } from './book-indexing.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'book-indexing',
    }),
  ],
  providers: [SearchService, BookIndexingProcessor],
  exports: [SearchService, BullModule],
})
export class SearchModule {}
