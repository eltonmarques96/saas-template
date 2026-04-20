import React from 'react';
import Head from 'next/head';
import type { GetStaticPaths, GetStaticProps } from 'next';
import axios from 'axios';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { AdBanner } from '@/components/AdBanner/AdBanner';
import { BookCard } from '@/components/BookCard/BookCard';
import { EmptyState } from '@/components/EmptyState/EmptyState';

interface CategoryBook {
  id: string;
  title: string;
  coverUrl?: string;
  author?: { name: string };
  averageStars?: number;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface CategoryPageProps {
  category: Category;
  books: CategoryBook[];
}

export default function CategoryPage({ category, books }: CategoryPageProps) {
  const sortedBooks = [...books].sort(
    (a, b) => (b.averageStars ?? 0) - (a.averageStars ?? 0)
  );

  return (
    <>
      <Head>
        <title>{category.name} | MyBookShelf</title>
        <meta
          name="description"
          content={
            category.description
              ? category.description.slice(0, 160)
              : `Livros da categoria ${category.name} no MyBookShelf`
          }
        />
      </Head>

      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-cream)' }}>
        <Header />

        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-espresso)' }}
          >
            {category.name}
          </h1>
          {category.description && (
            <p className="mb-4 text-sm" style={{ color: 'var(--color-muted)' }}>
              {category.description}
            </p>
          )}

          <AdBanner />

          <section>
            {sortedBooks.length === 0 ? (
              <EmptyState message="Nenhum livro nesta categoria ainda." icon="🏷️" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {sortedBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id as string;
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

  const [categoryRes, booksRes] = await Promise.allSettled([
    axios.get(`${apiBase}/categories/${id}`),
    axios.get(`${apiBase}/books/category/${id}`),
  ]);

  if (categoryRes.status === 'rejected') {
    return { notFound: true };
  }

  const category: Category = categoryRes.value.data;

  const books: CategoryBook[] =
    booksRes.status === 'fulfilled'
      ? Array.isArray(booksRes.value.data)
        ? booksRes.value.data
        : booksRes.value.data?.data ?? booksRes.value.data?.items ?? []
      : [];

  return {
    props: {
      category,
      books,
      messages: (await import('../../../messages/pt.json')).default,
      locale: 'pt',
    },
    revalidate: 3600,
  };
};
