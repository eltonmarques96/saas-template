'use client';
import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Card, Typography, message, Spin } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { getBookById, updateBook } from '../../../lib/apiClient';

export default function BookEditPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getBookById(id)
      .then((book) => {
        form.setFieldsValue({
          title: book.title,
          coverUrl: book.coverUrl,
          synopsis: book.synopsis,
          pages: book.pages,
          publisher: book.publisher,
          isbn: book.isbn,
        });
      })
      .catch(() => {
        message.error('Erro ao carregar livro');
      })
      .finally(() => setLoading(false));
  }, [id, form]);

  const onFinish = async (values: Record<string, unknown>) => {
    setSaving(true);
    try {
      await updateBook(id, values);
      message.success('Livro atualizado com sucesso');
      router.push('/books');
    } catch {
      message.error('Erro ao atualizar livro');
    } finally {
      setSaving(false);
    }
  };

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
        Editar Livro
      </Typography.Title>
      <Card style={{ maxWidth: 600 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="Título" rules={[{ required: true, message: 'Informe o título' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="coverUrl" label="URL da Capa">
            <Input />
          </Form.Item>
          <Form.Item name="synopsis" label="Sinopse">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="pages" label="Páginas">
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="publisher" label="Editora">
            <Input />
          </Form.Item>
          <Form.Item name="isbn" label="ISBN">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              style={{ background: '#6B3A2A', borderColor: '#6B3A2A', marginRight: 8 }}
            >
              Salvar
            </Button>
            <Button onClick={() => router.push('/books')}>Cancelar</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
