import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import DashboardLayout from '../layout';
import AuthContext from '@/contexts/AuthContext';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import {
  getCollections,
  createCollection,
  deleteCollection,
} from '@/lib/apiClient';

interface BookCover {
  id: string;
  title: string;
  coverUrl?: string;
}

interface Collection {
  id: string;
  name: string;
  books?: BookCover[];
}

function CollectionsPage() {
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    setFetching(true);
    getCollections()
      .then((data) => {
        const list: Collection[] = Array.isArray(data)
          ? data
          : data?.data ?? data?.items ?? [];
        setCollections(list);
      })
      .catch(() => setCollections([]))
      .finally(() => setFetching(false));
  }, [isAuthenticated]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const created = await createCollection(newName.trim());
      setCollections((prev) => [created, ...prev]);
      setNewName('');
      setShowModal(false);
    } catch {
      alert('Erro ao criar coleção.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja deletar a coleção "${name}"?`)) return;
    try {
      await deleteCollection(id);
      setCollections((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert('Erro ao deletar coleção.');
    }
  };

  if (authLoading || fetching) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '100%' }}>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-3xl font-bold"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: 'var(--color-espresso)',
          }}
        >
          Minhas Coleções
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded text-white text-sm font-medium"
          style={{ backgroundColor: 'var(--color-mahogany)' }}
        >
          Nova Coleção
        </button>
      </div>

      {/* Collections grid */}
      {collections.length === 0 ? (
        <EmptyState
          message="Você ainda não tem coleções. Crie uma para começar!"
          icon="📚"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col) => {
            const books = col.books ?? [];
            const thumbnails = books.slice(0, 4);
            return (
              <div
                key={col.id}
                className="rounded-lg p-4 shadow-sm flex flex-col gap-3"
                style={{ backgroundColor: 'var(--color-parchment)' }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2
                      className="text-base font-semibold"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: 'var(--color-espresso)',
                      }}
                    >
                      {col.name}
                    </h2>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                      {books.length} livro{books.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Thumbnails row */}
                {thumbnails.length > 0 && (
                  <div className="flex gap-2">
                    {thumbnails.map((book) => (
                      <div
                        key={book.id}
                        className="relative rounded overflow-hidden flex-shrink-0"
                        style={{
                          width: 40,
                          height: 56,
                          background: 'var(--color-walnut)',
                        }}
                      >
                        {book.coverUrl ? (
                          <Image
                            src={book.coverUrl}
                            alt={book.title}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-xs"
                            style={{ color: 'var(--color-parchment)' }}
                          >
                            📖
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 mt-auto">
                  <Link
                    href={`/dashboard/collections/${col.id}`}
                    className="text-sm font-medium hover:underline"
                    style={{ color: 'var(--color-mahogany)' }}
                  >
                    Abrir
                  </Link>
                  <button
                    onClick={() => handleDelete(col.id, col.name)}
                    className="text-sm hover:underline"
                    style={{ color: '#c0392b' }}
                  >
                    Deletar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create collection modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div
            className="rounded-xl p-6 w-full max-w-sm shadow-2xl"
            style={{ backgroundColor: 'var(--color-cream)' }}
          >
            <h2
              className="text-xl font-bold mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: 'var(--color-espresso)',
              }}
            >
              Nova Coleção
            </h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nome da coleção"
                required
                className="w-full px-3 py-2 text-sm rounded border outline-none"
                style={{
                  borderColor: 'var(--color-walnut)',
                  color: 'var(--color-ink)',
                  background: '#fff',
                }}
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setNewName('');
                  }}
                  className="px-4 py-2 rounded text-sm"
                  style={{
                    color: 'var(--color-muted)',
                    border: '1px solid var(--color-muted)',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating || !newName.trim()}
                  className="px-4 py-2 rounded text-white text-sm font-medium disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-mahogany)' }}
                >
                  {creating ? 'Criando...' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

CollectionsPage.getLayout = function getLayout(page: React.ReactNode) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default CollectionsPage;
