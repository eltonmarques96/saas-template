import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';

export interface OpenLibraryBookData {
  title: string;
  coverUrl: string | null;
  synopsis: string | null;
  pages: number | null;
  publishedDate: string | null;
  publisher: string | null;
  isbn: string | null;
  siteUrl: string | null;
  openLibraryId: string | null;
  author: {
    name: string;
    pageUrl: string | null;
  } | null;
  categories: string[];
}

/**
 * Service that communicates with the OpenLibrary public API to
 * fetch book metadata by ISBN or by OpenLibrary work ID.
 */
@ApiTags('books')
@Injectable()
export class OpenLibraryService {
  private readonly logger = new Logger(OpenLibraryService.name);
  private readonly baseUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.baseUrl =
      process.env.OPEN_LIBRARY_BASE_URL || 'https://openlibrary.org';
  }

  /**
   * Fetch book data from OpenLibrary by ISBN.
   * Returns null if the book is not found or an error occurs.
   */
  async fetchByIsbn(isbn: string): Promise<OpenLibraryBookData | null> {
    try {
      const url = `${this.baseUrl}/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data as Record<string, any>;
      const key = `ISBN:${isbn}`;

      if (!data[key]) {
        return null;
      }

      const bookData = data[key] as Record<string, any>;
      return this.mapBookData(bookData, isbn);
    } catch (error) {
      this.logger.warn(
        `Failed to fetch book from OpenLibrary by ISBN ${isbn}: ${(error as Error).message}`,
      );
      return null;
    }
  }

  /**
   * Search OpenLibrary by title/query string.
   * Returns up to `limit` results as lightweight BookPreview-compatible objects.
   */
  async searchByTitle(
    query: string,
    limit = 20,
  ): Promise<OpenLibraryBookData[]> {
    try {
      const url = `${this.baseUrl}/search.json?q=${encodeURIComponent(query)}&limit=${limit}`;
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data as Record<string, any>;
      const docs: any[] = data.docs ?? [];

      return docs.map((doc) => {
        const coverId = doc.cover_i ?? null;
        return {
          title: doc.title ?? '',
          coverUrl: coverId
            ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
            : null,
          synopsis: null,
          pages: doc.number_of_pages_median ?? null,
          publishedDate: doc.first_publish_year
            ? String(doc.first_publish_year)
            : null,
          publisher:
            doc.publisher && doc.publisher.length > 0 ? doc.publisher[0] : null,
          isbn:
            doc.isbn && doc.isbn.length > 0 ? (doc.isbn[0] as string) : null,
          siteUrl: doc.key ? `${this.baseUrl}${doc.key}` : null,
          openLibraryId: doc.key ?? null,
          author:
            doc.author_name && doc.author_name.length > 0
              ? { name: doc.author_name[0] as string, pageUrl: null }
              : null,
          categories: (doc.subject ?? []).slice(0, 5) as string[],
        } satisfies OpenLibraryBookData;
      });
    } catch (error) {
      this.logger.warn(
        `Failed to search OpenLibrary for "${query}": ${(error as Error).message}`,
      );
      return [];
    }
  }

  /**
   * Fetch book data from OpenLibrary by work ID.
   * Returns null if the book is not found or an error occurs.
   */
  async fetchById(openLibraryId: string): Promise<OpenLibraryBookData | null> {
    try {
      const cleanId = openLibraryId.startsWith('/')
        ? openLibraryId
        : `/works/${openLibraryId}`;
      const url = `${this.baseUrl}${cleanId}.json`;
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data as Record<string, any>;

      // Resolve cover: works API returns an array of cover IDs
      const coverId: number | null =
        Array.isArray(data.covers) && data.covers.length > 0
          ? (data.covers[0] as number)
          : null;
      const coverUrl = coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
        : null;

      // Resolve author: works API returns author key references, fetch the first one
      let author: { name: string; pageUrl: string | null } | null = null;
      const authorKey: string | null =
        Array.isArray(data.authors) && data.authors.length > 0
          ? ((data.authors[0]?.author?.key as string | undefined) ?? null)
          : null;

      if (authorKey) {
        try {
          const authorResponse = await firstValueFrom(
            this.httpService.get(`${this.baseUrl}${authorKey}.json`),
          );
          const authorData = authorResponse.data as Record<string, any>;
          const name: string =
            authorData.name ?? authorData.personal_name ?? '';
          if (name) {
            author = {
              name,
              pageUrl: `${this.baseUrl}${authorKey}`,
            };
          }
        } catch {
          // author fetch is best-effort
        }
      }

      return this.mapWorkData(data, openLibraryId, coverUrl, author);
    } catch (error) {
      this.logger.warn(
        `Failed to fetch book from OpenLibrary by ID ${openLibraryId}: ${(error as Error).message}`,
      );
      return null;
    }
  }

  private mapBookData(
    data: Record<string, any>,
    isbn: string,
  ): OpenLibraryBookData {
    const authorName =
      data.authors && data.authors.length > 0 ? data.authors[0].name : null;
    const authorUrl =
      data.authors && data.authors.length > 0
        ? (data.authors[0].url ?? null)
        : null;

    const coverId =
      data.cover?.large ?? data.cover?.medium ?? data.cover?.small ?? null;

    const publishedDate = data.publish_date ?? null;

    const publisher =
      data.publishers && data.publishers.length > 0
        ? data.publishers[0].name
        : null;

    const subjects: string[] = (data.subjects ?? []).map((s: any) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      typeof s === 'string' ? s : (s?.name ?? ''),
    );

    const workKey: string | null = data.identifiers?.openlibrary?.[0] ?? null;

    return {
      title: data.title ?? '',
      coverUrl: coverId,
      synopsis:
        typeof data.excerpts?.[0]?.text === 'string'
          ? data.excerpts[0].text
          : null,
      pages: data.number_of_pages ?? null,
      publishedDate,
      publisher,
      isbn,
      siteUrl: data.url ?? null,
      openLibraryId: workKey,
      author: authorName ? { name: authorName, pageUrl: authorUrl } : null,
      categories: subjects,
    };
  }

  private mapWorkData(
    data: Record<string, any>,
    openLibraryId: string,
    coverUrl: string | null,
    author: { name: string; pageUrl: string | null } | null,
  ): OpenLibraryBookData {
    const description =
      typeof data.description === 'string'
        ? data.description
        : (data.description?.value ?? null);

    const subjects: string[] = data.subjects ?? [];

    return {
      title: data.title ?? '',
      coverUrl,
      synopsis: description,
      pages: null,
      publishedDate: data.first_publish_date ?? null,
      publisher: null,
      isbn: null,
      siteUrl: `${this.baseUrl}${data.key ?? ''}`,
      openLibraryId: data.key ?? openLibraryId,
      author,
      categories: subjects,
    };
  }
}
