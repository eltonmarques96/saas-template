import { Injectable, Logger } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';

export interface BookPreview {
  id: string;
  title: string;
  authorName: string;
  coverUrl?: string;
  siteUrl?: string;
  /** Present only for OpenLibrary fallback results (no local DB id yet). */
  isbn?: string;
  openLibraryId?: string;
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private client: Client;

  constructor() {
    const clientOptions: any = {
      node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
    };

    if (process.env.ELASTICSEARCH_USERNAME) {
      clientOptions.auth = {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD || '',
      };
    }

    this.client = new Client(clientOptions);
  }

  /**
   * Index a book document in Elasticsearch.
   * Fails silently if Elasticsearch is not available.
   */
  async indexBook(book: BookPreview): Promise<void> {
    try {
      await this.client.index({
        index: 'books',
        id: book.id,
        document: book,
      });
    } catch (error) {
      this.logger.warn(
        `Elasticsearch indexBook failed (non-critical): ${(error as Error).message}`,
      );
    }
  }

  /**
   * Full-text search on books by title and author name.
   * Returns empty array if Elasticsearch is not available.
   */
  async searchBooks(query: string): Promise<BookPreview[]> {
    if (!query || !query.trim()) {
      return [];
    }

    try {
      const result = await this.client.search<BookPreview>({
        index: 'books',
        query: {
          multi_match: {
            query,
            fields: ['title', 'authorName'],
            fuzziness: 'AUTO',
          },
        },
      });

      return result.hits.hits.map((hit) => hit._source as BookPreview);
    } catch (error) {
      this.logger.warn(
        `Elasticsearch searchBooks failed (non-critical): ${(error as Error).message}`,
      );
      return [];
    }
  }

  /**
   * Delete a book document from Elasticsearch.
   * Fails silently if Elasticsearch is not available.
   */
  async deleteBook(bookId: string): Promise<void> {
    try {
      await this.client.delete({
        index: 'books',
        id: bookId,
      });
    } catch (error) {
      this.logger.warn(
        `Elasticsearch deleteBook failed (non-critical): ${(error as Error).message}`,
      );
    }
  }
}
