'use client';
import { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Table, Typography, Spin } from 'antd';
import { getStats, getBooks, getUsers } from '../lib/apiClient';

interface Stats {
  totalBooks: number;
  totalUsers: number;
  totalReviews: number;
  topBook: { id: string; title: string; viewCount: number } | null;
}

interface Book {
  id: string;
  title: string;
  viewCount: number;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [topBooks, setTopBooks] = useState<Book[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStats(), getBooks(10), getUsers(1, 5)])
      .then(([statsData, booksData, usersData]) => {
        setStats(statsData);
        setTopBooks(Array.isArray(booksData) ? booksData : []);
        setRecentUsers(Array.isArray(usersData) ? usersData : usersData?.users ?? usersData?.data ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  const booksColumns = [
    { title: 'Título', dataIndex: 'title', key: 'title' },
    {
      title: 'Visualizações',
      dataIndex: 'viewCount',
      key: 'viewCount',
      sorter: (a: Book, b: Book) => (b.viewCount ?? 0) - (a.viewCount ?? 0),
      render: (value: number) => (value ?? 0).toLocaleString('pt-BR'),
    },
  ];

  const usersColumns = [
    {
      title: 'Nome',
      key: 'name',
      render: (record: User) => `${record.firstName} ${record.lastName}`,
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Cadastro',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v: string) => (v ? new Date(v).toLocaleDateString('pt-BR') : '—'),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Typography.Title level={2} style={{ color: '#3B1F10', marginBottom: 24 }}>
        Dashboard
      </Typography.Title>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ background: '#F5E6D3' }}>
            <Statistic
              title={<span style={{ color: '#3B1F10' }}>Total de Livros</span>}
              value={stats?.totalBooks ?? 0}
              valueStyle={{ color: '#C4894F' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ background: '#F5E6D3' }}>
            <Statistic
              title={<span style={{ color: '#3B1F10' }}>Total de Usuários</span>}
              value={stats?.totalUsers ?? 0}
              valueStyle={{ color: '#C4894F' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ background: '#F5E6D3' }}>
            <Statistic
              title={<span style={{ color: '#3B1F10' }}>Total de Avaliações</span>}
              value={stats?.totalReviews ?? 0}
              valueStyle={{ color: '#C4894F' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ background: '#F5E6D3' }}>
            <Statistic
              title={<span style={{ color: '#3B1F10' }}>Livro Mais Acessado</span>}
              value={stats?.topBook?.viewCount ?? 0}
              suffix="views"
              valueStyle={{ color: '#C4894F' }}
            />
            {stats?.topBook && (
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {stats.topBook.title}
              </Typography.Text>
            )}
          </Card>
        </Col>
      </Row>

      {/* Tables */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title={<span style={{ color: '#3B1F10' }}>Top 10 Livros Mais Acessados</span>}>
            <Table
              dataSource={topBooks}
              columns={booksColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<span style={{ color: '#3B1F10' }}>Últimos Usuários Cadastrados</span>}>
            <Table
              dataSource={recentUsers}
              columns={usersColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
