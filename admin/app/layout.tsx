import type { Metadata } from 'next';
import './globals.css';
import { AdminLayout } from '../components/AdminLayout';

export const metadata: Metadata = {
  title: 'MyBookShelf Admin',
  description: 'Painel de administração do MyBookShelf',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  );
}
