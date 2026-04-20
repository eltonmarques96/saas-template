import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '../layout';
import AuthContext from '@/contexts/AuthContext';
import { BookCard } from '@/components/BookCard/BookCard';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { getCollectionById, removeBookFromCollection } from '@/lib/apiClient';

interface BookInCollection {
  id: string;
  title: string;
  coverUrl?: string;
  author?: { name: string };
  averageStars?: number;
}

interface CollectionDetail {
  id: string;
  name: string;
  books?: BookInCollection[];
}

function CollectionDetailPage() {
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();
  const { id } = router.query;

  const [collection, setCollection] = useState<CollectionDetail | null>(null);
  const [fetching, setFetching] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated || !id || typeof id !== 'string') return;
    setFetching(true);
    getCollectionById(id)
      .then((data) => setCollection(data))
      .catch(() => setCollection(null))
      .finally(() => setFetching(false));
  }, [isAuthenticated, id]);

  const handleRemove = async (bookId: string) => {
    if (!collection) return;
    setRemoving(bookId);
    try {
      await removeBookFromCollection(collection.id, bookId);
      setCollection((prev) =>
        prev
          ? { ...prev, books: (prev.books ?? []).filter((b) => b.id !== bookId) }
          : prev
      );
    } catch {
      alert('Erro ao remover livro da coleção.');
    } finally {
      setRemoving(null);
    }
  };

  if (authLoading || fetching) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (!collection) {
    return (
      <EmptyState message="Coleção não encontrada." icon="📚" />
    );
  }

  const books = collection.books ?? [];

  return (
    <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '100%' }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/collections"
          className="text-sm hover:underline flex items-center gap-1"
          style={{ color: 'var(--color-mahogany)' }}
        >
          &#8592; Voltar
        </Link>
        <h1
          className="text-3xl font-bold"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: 'var(--color-espresso)',
          }}
        >
          {collection.name}
        </h1>
      </div>

      {books.length === 0 ? (
        <EmptyState
          message="Esta coleção ainda não tem livros."
          icon="📖"
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {books.map((book) => (
            <div key={book.id} className="flex flex-col gap-2">
              <BookCard book={book} />
              <button
                onClick={() => handleRemove(book.id)}
                disabled={removing === book.id}
                className="w-full text-xs py-1 rounded disabled:opacity-50"
                style={{
                  color: 'var(--color-muted)',
                  border: '1px solid var(--color-muted)',
                  background: 'transparent',
                }}
              >
                {removing === book.id ? 'Removendo...' : 'Remover'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

CollectionDetailPage.getLayout = function getLayout(page: React.ReactNode) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default CollectionDetailPage;
