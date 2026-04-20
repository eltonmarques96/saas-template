import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import axios from 'axios';
import { AppModule } from '../../app.module';
import { BooksService } from '../../books/books.service';

interface TrendingWork {
  key: string;
  title: string;
}

interface TrendingResponse {
  works: TrendingWork[];
}

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  const booksService = app.get(BooksService);

  try {
    const baseUrl =
      process.env.OPEN_LIBRARY_BASE_URL || 'https://openlibrary.org';
    const response = await axios.get<TrendingResponse>(
      `${baseUrl}/trending/forever.json?limit=100`,
    );

    const works = response.data.works ?? [];

    for (let i = 0; i < works.length; i++) {
      const work = works[i];
      const workId = work.key.replace('/works/', '');

      await booksService.findByOpenLibraryId(workId);

      await new Promise((resolve) => setTimeout(resolve, 600));
    }
  } finally {
    await app.close();
  }
}

seed().catch(() => {
  process.exit(1);
});
