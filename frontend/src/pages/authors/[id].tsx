import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import type { GetStaticPaths, GetStaticProps } from 'next';
import axios from 'axios';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { BookCard } from '@/components/BookCard/BookCard';
import { EmptyState } from '@/components/EmptyState/EmptyState';

interface AuthorBook {
  id: string;
  title: string;
  coverUrl?: string;
  author?: { name: string };
  averageStars?: number;
}

interface Author {
  id: string;
  name: string;
  photoUrl?: string;
  bio?: string;
}

interface AuthorPageProps {
  author: Author;
  books: AuthorBook[];
}

export default function AuthorPage({ author, books }: AuthorPageProps) {
  return (
    <>
      <Head>
        <title>{author.name} | MyBookShelf</title>
        <meta
          name="description"
          content={author.bio ? author.bio.slice(0, 160) : `Livros de ${author.name} no MyBookShelf`}
        />
      </Head>

      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-cream)' }}>
        <Header />

        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
          {/* Author info */}
          <div className="flex flex-col md:flex-row gap-6 mb-10">
            {author.photoUrl && (
              <div className="flex-shrink-0">
                <div
                  className="relative rounded-full overflow-hidden shadow-md"
                  style={{ width: 120, height: 120 }}
                >
                  <Image
                    src={author.photoUrl}
                    alt={author.name}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            <div>
              <h1
                className="text-3xl font-bold mb-2"
                style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-espresso)' }}
              >
                {author.name}
              </h1>
              {author.bio && (
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink)' }}>
                  {author.bio}
                </p>
              )}
            </div>
          </div>

          {/* Books by author */}
          <section>
            <h2
              className="text-xl font-bold mb-4"
              style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-espresso)' }}
            >
              Livros de {author.name}
            </h2>

            {books.length === 0 ? (
              <EmptyState message="Nenhum livro encontrado para este autor." icon="📚" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {books.map((book) => (
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

  const [authorRes, booksRes] = await Promise.allSettled([
    axios.get(`${apiBase}/authors/${id}`),
    axios.get(`${apiBase}/books/author/${id}`),
  ]);

  if (authorRes.status === 'rejected') {
    return { notFound: true };
  }

  const author: Author = authorRes.value.data;

  const books: AuthorBook[] =
    booksRes.status === 'fulfilled'
      ? Array.isArray(booksRes.value.data)
        ? booksRes.value.data
        : booksRes.value.data?.data ?? booksRes.value.data?.items ?? []
      : [];

  return {
    props: {
      author,
      books,
      messages: (await import('../../../messages/pt.json')).default,
      locale: 'pt',
    },
    revalidate: 3600,
  };
};
