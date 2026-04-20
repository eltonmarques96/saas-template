'use client';
import { useEffect, useState } from 'react';
import { Table, Tag, Button, Popconfirm, Space, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getUsers, updateUser, deleteUser } from '../../lib/apiClient';

const { Title } = Typography;

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  activated: boolean;
  enabled: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const limit = 20;

  const fetchUsers = async (currentPage: number) => {
    setLoading(true);
    try {
      const data = await getUsers(currentPage, limit);
      const list: User[] = Array.isArray(data) ? data : data.users ?? data.data ?? [];
      setUsers(list);
      setTotal(data.total ?? list.length);
    } catch {
      message.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleToggleEnabled = async (user: User) => {
    setActionLoading(user.id);
    try {
      await updateUser(user.id, { enabled: !user.enabled });
      message.success(`Usuário ${user.enabled ? 'desabilitado' : 'habilitado'} com sucesso`);
      fetchUsers(page);
    } catch {
      message.error('Erro ao atualizar usuário');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    try {
      await deleteUser(id);
      message.success('Usuário excluído com sucesso');
      fetchUsers(page);
    } catch {
      message.error('Erro ao excluir usuário');
    } finally {
      setActionLoading(null);
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: 'Nome',
      key: 'name',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        if (!record.enabled) {
          return <Tag color="red">Desabilitado</Tag>;
        }
        if (record.activated) {
          return <Tag color="green">Ativo</Tag>;
        }
        return <Tag color="orange">Não Verificado</Tag>;
      },
    },
    {
      title: 'Verificação',
      key: 'activated',
      render: (_, record) =>
        record.activated ? (
          <Tag color="green">Verificado</Tag>
        ) : (
          <Tag color="default">Pendente</Tag>
        ),
    },
    {
      title: 'Data de Cadastro',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) =>
        value ? new Date(value).toLocaleDateString('pt-BR') : '—',
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            loading={actionLoading === record.id}
            onClick={() => handleToggleEnabled(record)}
            style={{
              background: record.enabled ? 'var(--color-muted)' : 'var(--color-mahogany)',
              color: 'white',
              border: 'none',
            }}
          >
            {record.enabled ? 'Desabilitar' : 'Habilitar'}
          </Button>
          <Popconfirm
            title="Excluir usuário"
            description="Tem certeza que deseja excluir este usuário?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
            okButtonProps={{ style: { background: 'var(--color-mahogany)', borderColor: 'var(--color-mahogany)' } }}
          >
            <Button
              size="small"
              danger
              loading={actionLoading === record.id}
            >
              Excluir
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ color: 'var(--color-espresso)', margin: 0 }}>
          Gerenciamento de Usuários
        </Title>
        <span style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          Total: {total} usuários
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
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={
            total > limit
              ? {
                  current: page,
                  pageSize: limit,
                  total,
                  onChange: (p) => setPage(p),
                  showSizeChanger: false,
                }
              : false
          }
        />
      </div>
    </div>
  );
}
