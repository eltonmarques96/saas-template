'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { searchBooks } from '@/lib/apiClient';

interface SearchResult {
  id: string;
  title: string;
  author?: { name: string };
}

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({ placeholder = 'Pesquisar livros...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    const data = await searchBooks(q);
    const list: SearchResult[] = Array.isArray(data) ? data : data.data ?? data.items ?? [];
    setResults(list);
    setOpen(list.length > 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSearch(val), 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setOpen(false);
    }
    if (e.key === 'Enter' && query.trim()) {
      setOpen(false);
      router.push(`/books/search?q=${encodeURIComponent(query)}`);
    }
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded-full text-sm outline-none"
        style={{
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.3)',
          color: '#fff',
        }}
      />
      {open && results.length > 0 && (
        <div
          className="absolute left-0 right-0 top-full mt-1 rounded-lg shadow-xl z-50 overflow-hidden"
          style={{ background: 'var(--color-cream)', border: '1px solid var(--color-parchment)' }}
        >
          {results.slice(0, 8).map((book) => (
            <button
              key={book.id}
              type="button"
              className="w-full text-left px-4 py-2 hover:bg-parchment transition-colors"
              style={{ color: 'var(--color-ink)' }}
              onMouseDown={() => {
                setOpen(false);
                router.push(`/books/${book.id}`);
              }}
            >
              <span className="block text-sm font-medium">{book.title}</span>
              {book.author && (
                <span className="block text-xs" style={{ color: 'var(--color-muted)' }}>
                  {book.author.name}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
