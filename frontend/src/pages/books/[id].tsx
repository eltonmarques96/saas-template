import React, { useContext, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { GetStaticPaths, GetStaticProps } from 'next';
import axios from 'axios';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { AdBanner } from '@/components/AdBanner/AdBanner';
import { StarRating } from '@/components/StarRating/StarRating';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import AuthContext from '@/contexts/AuthContext';
import {
  getCollections,
  addBookToCollection,
  createReview,
  updateReview,
  deleteReview,
} from '@/lib/apiClient';

interface Author {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface Review {
  id: string;
  stars: number;
  comment?: string;
  user?: { id: string; firstName: string; lastName: string };
  createdAt?: string;
}

interface Book {
  id: string;
  title: string;
  coverUrl?: string;
  synopsis?: string;
  pages?: number;
  publisher?: string;
  isbn?: string;
  publishedDate?: string;
  author?: Author;
  categories?: Category[];
  averageStars?: number;
}

interface Collection {
  id: string;
  name: string;
}

interface BookDetailProps {
  book: Book | null;
  reviews: Review[];
}

export default function BookDetailPage({ book, reviews: initialReviews }: BookDetailProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (router.isFallback) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-cream)' }}>
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div
              className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
              style={{ borderColor: 'var(--color-walnut)', borderTopColor: 'var(--color-mahogany)' }}
            />
            <p style={{ color: 'var(--color-muted)' }}>Buscando livro…</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-cream)' }}>
        <Head><title>Livro não encontrado | MyBookShelf</title></Head>
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-7xl mb-6">📚</div>
            <h1
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-espresso)' }}
            >
              Livro não encontrado
            </h1>
            <p className="mb-6 text-sm" style={{ color: 'var(--color-muted)' }}>
              Este livro não existe no nosso acervo nem foi encontrado no OpenLibrary.
            </p>
            <Link
              href="/"
              className="px-5 py-2 rounded text-white text-sm font-medium"
              style={{ backgroundColor: 'var(--color-mahogany)' }}
            >
              Voltar para o início
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const averageStars =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length
      : book.averageStars ?? 0;

  const userReview = user
    ? reviews.find((r) => r.user?.id === user.id)
    : null;

  const handleOpenCollections = async () => {
    const data = await getCollections();
    const list: Collection[] = Array.isArray(data)
      ? data
      : data?.data ?? data?.items ?? [];
    setCollections(list);
    setShowCollectionMenu(true);
  };

  const handleAddToCollection = async (collectionId: string) => {
    await addBookToCollection(collectionId, book.id);
    setShowCollectionMenu(false);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (editingReviewId) {
      const updated = await updateReview(editingReviewId, {
        stars: reviewStars,
        comment: reviewComment,
      });
      setReviews((prev) =>
        prev.map((r) => (r.id === editingReviewId ? { ...r, ...updated } : r))
      );
      setEditingReviewId(null);
    } else {
      const created = await createReview({
        bookId: book.id,
        stars: reviewStars,
        comment: reviewComment,
      });
      setReviews((prev) => [created, ...prev]);
    }
    setReviewStars(0);
    setReviewComment('');
    setSubmitting(false);
  };

  const handleEditReview = (review: Review) => {
    setEditingReviewId(review.id);
    setReviewStars(review.stars);
    setReviewComment(review.comment ?? '');
  };

  const handleDeleteReview = async (reviewId: string) => {
    await deleteReview(reviewId);
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    if (editingReviewId === reviewId) {
      setEditingReviewId(null);
      setReviewStars(0);
      setReviewComment('');
    }
  };

  return (
    <>
      <Head>
        <title>
          {book.title}
          {book.author ? ` — ${book.author.name}` : ''} | MyBookShelf
        </title>
        <meta
          name="description"
          content={book.synopsis ? book.synopsis.slice(0, 160) : `${book.title} no MyBookShelf`}
        />
      </Head>

      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-cream)' }}>
        <Header />

        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
          {/* Book details grid */}
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Cover */}
            <div className="flex-shrink-0 flex justify-center">
              <div
                className="relative rounded-lg overflow-hidden shadow-lg"
                style={{ width: 200, height: 300, background: 'var(--color-walnut)' }}
              >
                {book.coverUrl ? (
                  <Image
                    src={book.coverUrl}
                    alt={`Capa de ${book.title}`}
                    fill
                    sizes="200px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-6xl"
                    style={{ color: 'var(--color-parchment)' }}
                  >
                    📖
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1
                className="text-3xl font-bold mb-2"
                style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-espresso)' }}
              >
                {book.title}
              </h1>

              {book.author && (
                <p className="mb-2" style={{ color: 'var(--color-muted)' }}>
                  Autor:{' '}
                  <Link
                    href={`/authors/${book.author.id}`}
                    className="font-medium hover:underline"
                    style={{ color: 'var(--color-mahogany)' }}
                  >
                    {book.author.name}
                  </Link>
                </p>
              )}

              <div className="flex items-center gap-2 mb-3">
                <StarRating value={averageStars} readonly />
                <span className="text-sm" style={{ color: 'var(--color-muted)' }}>
                  ({reviews.length} avaliação{reviews.length !== 1 ? 'ões' : ''})
                </span>
              </div>

              {book.categories && book.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {book.categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.id}`}
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: 'var(--color-parchment)',
                        color: 'var(--color-mahogany)',
                        border: '1px solid var(--color-walnut)',
                      }}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Metadata table */}
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {book.publisher && (
                  <>
                    <dt style={{ color: 'var(--color-muted)' }}>Editora</dt>
                    <dd style={{ color: 'var(--color-ink)' }}>{book.publisher}</dd>
                  </>
                )}
                {book.pages && (
                  <>
                    <dt style={{ color: 'var(--color-muted)' }}>Páginas</dt>
                    <dd style={{ color: 'var(--color-ink)' }}>{book.pages}</dd>
                  </>
                )}
                {book.isbn && (
                  <>
                    <dt style={{ color: 'var(--color-muted)' }}>ISBN</dt>
                    <dd style={{ color: 'var(--color-ink)' }}>{book.isbn}</dd>
                  </>
                )}
                {book.publishedDate && (
                  <>
                    <dt style={{ color: 'var(--color-muted)' }}>Data de Publicação</dt>
                    <dd style={{ color: 'var(--color-ink)' }}>
                      {new Date(book.publishedDate).toLocaleDateString('pt-BR')}
                    </dd>
                  </>
                )}
              </dl>

              {/* Add to collection */}
              {isAuthenticated && (
                <div className="mt-4 relative inline-block">
                  <button
                    onClick={handleOpenCollections}
                    className="px-4 py-2 rounded text-white text-sm font-medium"
                    style={{ backgroundColor: 'var(--color-mahogany)' }}
                  >
                    Adicionar à Coleção
                  </button>
                  {showCollectionMenu && (
                    <div
                      className="absolute left-0 top-full mt-1 z-50 rounded-lg shadow-xl min-w-[200px]"
                      style={{
                        background: 'var(--color-cream)',
                        border: '1px solid var(--color-parchment)',
                      }}
                    >
                      {collections.length === 0 ? (
                        <p className="p-4 text-sm" style={{ color: 'var(--color-muted)' }}>
                          Nenhuma coleção encontrada.
                        </p>
                      ) : (
                        collections.map((col) => (
                          <button
                            key={col.id}
                            onClick={() => handleAddToCollection(col.id)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-amber-50 transition-colors"
                            style={{ color: 'var(--color-ink)' }}
                          >
                            {col.name}
                          </button>
                        ))
                      )}
                      <button
                        onClick={() => setShowCollectionMenu(false)}
                        className="w-full text-left px-4 py-2 text-xs border-t"
                        style={{ color: 'var(--color-muted)', borderColor: 'var(--color-parchment)' }}
                      >
                        Fechar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Synopsis */}
          {book.synopsis && (
            <section className="mb-6">
              <h2
                className="text-xl font-bold mb-3"
                style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-espresso)' }}
              >
                Sinopse
              </h2>
              <p className="leading-relaxed" style={{ color: 'var(--color-ink)' }}>
                {book.synopsis}
              </p>
            </section>
          )}

          <AdBanner />

          {/* Reviews Section */}
          <section>
            <h2
              className="text-xl font-bold mb-4"
              style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-espresso)' }}
            >
              Avaliações
            </h2>

            {/* Write review form (authenticated users without existing review, or editing) */}
            {isAuthenticated && (!userReview || editingReviewId) && (
              <form
                onSubmit={handleSubmitReview}
                className="mb-6 p-4 rounded-lg"
                style={{ backgroundColor: 'var(--color-parchment)' }}
              >
                <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--color-espresso)' }}>
                  {editingReviewId ? 'Editar Avaliação' : 'Escrever Avaliação'}
                </h3>
                <div className="mb-3">
                  <StarRating
                    value={reviewStars}
                    readonly={false}
                    onChange={setReviewStars}
                  />
                </div>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Escreva seu comentário (opcional)..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded border outline-none resize-none"
                  style={{
                    borderColor: 'var(--color-walnut)',
                    color: 'var(--color-ink)',
                    background: '#fff',
                  }}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    disabled={submitting || reviewStars === 0}
                    className="px-4 py-2 rounded text-white text-sm font-medium disabled:opacity-50"
                    style={{ backgroundColor: 'var(--color-mahogany)' }}
                  >
                    {editingReviewId ? 'Salvar' : 'Enviar'}
                  </button>
                  {editingReviewId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingReviewId(null);
                        setReviewStars(0);
                        setReviewComment('');
                      }}
                      className="px-4 py-2 rounded text-sm font-medium"
                      style={{
                        color: 'var(--color-muted)',
                        border: '1px solid var(--color-muted)',
                      }}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            )}

            {reviews.length === 0 ? (
              <EmptyState message="Nenhuma avaliação ainda. Seja o primeiro a avaliar!" icon="⭐" />
            ) : (
              <div className="flex flex-col gap-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: 'var(--color-parchment)',
                      border: '1px solid rgba(0,0,0,0.05)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                          {review.user
                            ? `${review.user.firstName} ${review.user.lastName}`
                            : 'Usuário anônimo'}
                        </span>
                        {review.createdAt && (
                          <span className="ml-2 text-xs" style={{ color: 'var(--color-muted)' }}>
                            {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                      {isAuthenticated && user && review.user?.id === user.id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditReview(review)}
                            className="text-xs hover:underline"
                            style={{ color: 'var(--color-mahogany)' }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-xs hover:underline"
                            style={{ color: '#c0392b' }}
                          >
                            Excluir
                          </button>
                        </div>
                      )}
                    </div>
                    <StarRating value={review.stars} readonly />
                    {review.comment && (
                      <p className="mt-2 text-sm" style={{ color: 'var(--color-ink)' }}>
                        {review.comment}
                      </p>
                    )}
                  </div>
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
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id as string;
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

  let book: Book | null = null;
  try {
    const bookRes = await axios.get(`${apiBase}/books/${id}`);
    book = bookRes.data as Book;
  } catch {
    return {
      props: {
        book: null,
        reviews: [],
        messages: (await import('../../../messages/pt.json')).default,
        locale: 'pt',
      },
      revalidate: 60,
    };
  }

  let reviews: Review[] = [];
  try {
    const reviewsRes = await axios.get(`${apiBase}/reviews/book/${book.id}`);
    const raw = reviewsRes.data;
    reviews = Array.isArray(raw) ? raw : raw?.data ?? raw?.items ?? [];
  } catch {
    reviews = [];
  }

  return {
    props: {
      book,
      reviews,
      messages: (await import('../../../messages/pt.json')).default,
      locale: 'pt',
    },
    revalidate: 3600,
  };
};
