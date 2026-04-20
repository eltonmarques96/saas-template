import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StarRating from '@/components/StarRating/StarRating';

interface BookCardBook {
  id: string;
  title: string;
  coverUrl?: string;
  author?: { name: string };
  averageStars?: number;
}

interface BookCardProps {
  book: BookCardBook;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/books/${book.id}`} className="block group">
      <div
        className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-200"
        style={{ backgroundColor: 'var(--color-parchment)' }}
      >
        <div className="relative w-full" style={{ aspectRatio: '2/3', background: 'var(--color-walnut)' }}>
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt={`Capa de ${book.title}`}
              fill
              sizes="(max-width: 768px) 50vw, 200px"
              className="object-cover group-hover:opacity-90 transition-opacity"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ color: 'var(--color-parchment)', fontSize: 48 }}
            >
              📖
            </div>
          )}
        </div>
        <div className="p-3">
          <h3
            className="text-sm font-semibold leading-tight line-clamp-2 mb-1"
            style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-ink)' }}
          >
            {book.title}
          </h3>
          {book.author && (
            <p className="text-xs mb-2" style={{ color: 'var(--color-muted)' }}>
              {book.author.name}
            </p>
          )}
          {book.averageStars !== undefined && (
            <StarRating value={book.averageStars} readonly />
          )}
        </div>
      </div>
    </Link>
  );
}

export default BookCard;
