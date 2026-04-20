'use client';

import React, { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import AuthContext from '@/contexts/AuthContext';

export function Header() {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <header
      className="w-full flex items-center justify-between px-6 py-3 gap-4"
      style={{ backgroundColor: 'var(--color-espresso)' }}
    >
      {/* Logo */}
      <Link href="/" className="flex-shrink-0 flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="MyBookShelf"
          width={40}
          height={40}
          className="rounded"
          priority
        />
        <span
          className="hidden sm:block text-white font-semibold text-lg"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          MyBookShelf
        </span>
      </Link>

      {/* Search bar — center */}
      <div className="flex-1 flex justify-center">
        <SearchBar placeholder="Pesquisar livros..." />
      </div>

      {/* Auth actions */}
      <nav className="flex items-center gap-3 flex-shrink-0">
        {isAuthenticated ? (
          <>
            <Link
              href="/dashboard/collections"
              className="text-sm font-medium text-white hover:text-amber-300 transition-colors"
            >
              Minhas Coleções
            </Link>
            <button
              onClick={() => logout()}
              className="text-sm font-medium px-3 py-1 rounded border border-white/40 text-white hover:bg-white/10 transition-colors"
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm font-medium text-white hover:text-amber-300 transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium px-3 py-1 rounded text-white transition-colors"
              style={{ backgroundColor: 'var(--color-mahogany)' }}
            >
              Cadastrar
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
