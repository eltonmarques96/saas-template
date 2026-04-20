'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token && pathname !== '/login') {
      router.replace('/login');
    } else {
      setIsReady(true);
    }
  }, [pathname, router]);

  if (pathname === '/login') return <>{children}</>;
  if (!isReady) return null;

  const logout = () => {
    localStorage.removeItem('admin_token');
    router.replace('/login');
  };

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/users', label: 'Usuários', icon: '👥' },
    { href: '/books', label: 'Livros', icon: '📚' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 250,
          background: 'var(--color-espresso)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 0',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
        }}
      >
        <div style={{ padding: '0 24px 24px' }}>
          <Image src="/logo.png" alt="MyBookShelf" width={40} height={40} />
          <h2
            style={{
              color: 'var(--color-parchment)',
              marginTop: 8,
              fontSize: 18,
              fontFamily: 'Playfair Display, serif',
            }}
          >
            MyBookShelf Admin
          </h2>
        </div>
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 24px',
                color: 'white',
                textDecoration: 'none',
                background:
                  pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                    ? 'var(--color-mahogany)'
                    : 'transparent',
                transition: 'background 0.2s',
              }}
            >
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={logout}
          style={{
            margin: '0 24px 24px',
            padding: '12px',
            background: 'var(--color-mahogany)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Sair
        </button>
      </aside>
      {/* Main Content */}
      <main
        style={{
          marginLeft: 250,
          flex: 1,
          padding: 32,
          background: 'var(--color-cream)',
          minHeight: '100vh',
        }}
      >
        {children}
      </main>
    </div>
  );
}
