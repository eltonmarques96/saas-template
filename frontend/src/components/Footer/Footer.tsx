import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full mt-auto py-8 px-6"
      style={{ backgroundColor: 'var(--color-espresso)', color: '#e8d5c3' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span
            className="text-lg font-semibold"
            style={{ fontFamily: "'Playfair Display', serif", color: '#fff' }}
          >
            MyBookShelf
          </span>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
            Descubra, cataloge e avalie seus livros favoritos.
          </p>
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-white transition-colors">
            Início
          </Link>
          <Link href="/dashboard/collections" className="hover:text-white transition-colors">
            Coleções
          </Link>
        </nav>
        <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
          &copy; {currentYear} MyBookShelf. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
