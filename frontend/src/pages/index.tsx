import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { GetServerSideProps } from 'next';
import axios from 'axios';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { BookCard } from '@/components/BookCard/BookCard';
import { AdBanner } from '@/components/AdBanner/AdBanner';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { EmptyState } from '@/components/EmptyState/EmptyState';

interface BookItem {
  id: string;
  title: string;
  coverUrl?: string;
  author?: { name: string };
  averageStars?: number;
}

interface CategoryItem {
  id: string;
  name: string;
}

interface HomeProps {
  popularBooks: BookItem[];
  categories: CategoryItem[];
}

export default function HomePage({ popularBooks, categories }: HomeProps) {
  return (
    <>
      <Head>
        <title>MyBookShelf — Descubra seus próximos livros</title>
        <meta name="description" content="Plataforma para descobrir, catalogar e avaliar livros" />
        <meta property="og:title" content="MyBookShelf — Descubra seus próximos livros" />
        <meta property="og:description" content="Plataforma para descobrir, catalogar e avaliar livros" />
      </Head>

      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: 'var(--color-cream)' }}
      >
        <Header />

        {/* Hero Section */}
        <section
          className="w-full py-20 px-6 flex flex-col items-center justify-center text-center"
          style={{
            background: `linear-gradient(135deg, var(--color-espresso) 0%, var(--color-mahogany) 50%, var(--color-walnut) 100%)`,
          }}
        >
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Descubra seus próximos livros
          </h1>
          <p className="text-lg mb-8 max-w-xl" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Explore, cataloge e avalie livros que transformam sua visão de mundo.
          </p>
          <div className="w-full max-w-lg">
            <SearchBar placeholder="Pesquisar livros..." />
          </div>
        </section>

        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
          <AdBanner />

          {/* Popular Books Section */}
          <section className="mb-12">
            <h2
              className="text-2xl font-bold mb-6"
              style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-espresso)' }}
            >
              Livros Populares
            </h2>
            {popularBooks.length === 0 ? (
              <EmptyState message="Nenhum livro popular no momento." icon="📚" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {popularBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </section>

          {/* Categories Section */}
          <section className="mb-12">
            <h2
              className="text-2xl font-bold mb-6"
              style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-espresso)' }}
            >
              Categorias
            </h2>
            {categories.length === 0 ? (
              <EmptyState message="Nenhuma categoria disponível." icon="🏷️" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.id}`}
                    className="rounded-lg p-4 text-center font-medium transition-shadow hover:shadow-md"
                    style={{
                      backgroundColor: 'var(--color-parchment)',
                      color: 'var(--color-mahogany)',
                      border: '1px solid var(--color-walnut)',
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    {cat.name}
                  </Link>
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

export const getServerSideProps: GetServerSideProps = async () => {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

  const [booksRes, catsRes] = await Promise.allSettled([
    axios.get(`${apiBase}/books/popular?limit=10`),
    axios.get(`${apiBase}/categories`),
  ]);

  const popularBooks: BookItem[] =
    booksRes.status === 'fulfilled'
      ? Array.isArray(booksRes.value.data)
        ? booksRes.value.data
        : booksRes.value.data?.data ?? booksRes.value.data?.items ?? []
      : [];

  const categories: CategoryItem[] =
    catsRes.status === 'fulfilled'
      ? Array.isArray(catsRes.value.data)
        ? catsRes.value.data
        : catsRes.value.data?.data ?? catsRes.value.data?.items ?? []
      : [];

  return {
    props: {
      popularBooks,
      categories,
      messages: (await import('../../messages/pt.json')).default,
      locale: 'pt',
    },
  };
};
