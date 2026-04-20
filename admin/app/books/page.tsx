'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, Button, Popconfirm, Space, Typography, Input, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import { getBooks, deleteBook } from '../../lib/apiClient';

const { Title } = Typography;
const { Search } = Input;

interface Book {
  id: string;
  title: string;
  coverUrl: string;
  author: { name: string } | null;
  isbn: string;
  viewCount: number;
  createdAt: string;
}

export default function BooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [filtered, setFiltered] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await getBooks(200);
      const list: Book[] = Array.isArray(data) ? data : data.books ?? data.data ?? [];
      setBooks(list);
      setFiltered(list);
    } catch {
      message.error('Erro ao carregar livros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (!searchText.trim()) {
      setFiltered(books);
    } else {
      const lower = searchText.toLowerCase();
      setFiltered(
        books.filter(
          (b) =>
            b.title.toLowerCase().includes(lower) ||
            (b.isbn ?? '').toLowerCase().includes(lower)
        )
      );
    }
  }, [searchText, books]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteBook(id);
      message.success('Livro excluído com sucesso');
      fetchBooks();
    } catch {
      message.error('Erro ao excluir livro');
    } finally {
      setDeletingId(null);
    }
  };

  const columns: ColumnsType<Book> = [
    {
      title: 'Capa',
      dataIndex: 'coverUrl',
      key: 'coverUrl',
      width: 70,
      render: (url: string, record) =>
        url ? (
          <Image
            src={url}
            alt={record.title}
            width={40}
            height={60}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            unoptimized
          />
        ) : (
          <div
            style={{
              width: 40,
              height: 60,
              background: 'var(--color-parchment)',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            📚
          </div>
        ),
    },
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Autor',
      key: 'author',
      render: (_, record) => record.author?.name ?? '—',
    },
    {
      title: 'ISBN',
      dataIndex: 'isbn',
      key: 'isbn',
      render: (value: string) => value || '—',
    },
    {
      title: 'Visualizações',
      dataIndex: 'viewCount',
      key: 'viewCount',
      sorter: (a, b) => (a.viewCount ?? 0) - (b.viewCount ?? 0),
      defaultSortOrder: 'descend',
      render: (value: number) => (value ?? 0).toLocaleString('pt-BR'),
    },
    {
      title: 'Data de Cadastro',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => (value ? new Date(value).toLocaleDateString('pt-BR') : '—'),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => router.push(`/books/${record.id}`)}
            style={{
              background: 'var(--color-mahogany)',
              color: 'white',
              border: 'none',
            }}
          >
            Editar
          </Button>
          <Popconfirm
            title="Excluir livro"
            description="Tem certeza que deseja excluir este livro?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
            okButtonProps={{
              style: { background: 'var(--color-mahogany)', borderColor: 'var(--color-mahogany)' },
            }}
          >
            <Button size="small" danger loading={deletingId === record.id}>
              Excluir
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Title level={2} style={{ color: 'var(--color-espresso)', margin: 0 }}>
          Gerenciamento de Livros
        </Title>
        <span style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          {filtered.length} livro{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div
        style={{
          background: 'white',
          borderRadius: 8,
          padding: 24,
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        }}
      >
        <Search
          placeholder="Buscar por título ou ISBN..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: 400, marginBottom: 16 }}
          allowClear
        />
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 20, showSizeChanger: false }}
        />
      </div>
    </div>
  );
}
