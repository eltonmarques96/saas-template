import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { SearchService, BookPreview } from './search.service';

export type BookIndexingJobData = BookPreview;

@Processor('book-indexing')
export class BookIndexingProcessor {
  private readonly logger = new Logger(BookIndexingProcessor.name);

  constructor(private readonly searchService: SearchService) {}

  @Process()
  async handleIndexBook(job: Job<BookIndexingJobData>): Promise<void> {
    this.logger.debug(`Indexing book ${job.data.id} into Elasticsearch`);
    await this.searchService.indexBook(job.data);
    this.logger.debug(`Book ${job.data.id} indexed successfully`);
  }
}
