'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin } from '../../lib/apiClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await adminLogin(email, password);
      localStorage.setItem('admin_token', data.access_token);
      router.replace('/');
    } catch {
      setError('Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-cream)',
      }}
    >
      <div
        style={{
          background: 'white',
          padding: 48,
          borderRadius: 12,
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
          width: 400,
        }}
      >
        <h1 style={{ color: 'var(--color-espresso)', marginBottom: 8 }}>MyBookShelf Admin</h1>
        <p style={{ color: 'var(--color-muted)', marginBottom: 32 }}>
          Acesso restrito a administradores
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 4, color: 'var(--color-ink)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--color-muted)',
                borderRadius: 6,
                boxSizing: 'border-box',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 4, color: 'var(--color-ink)' }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--color-muted)',
                borderRadius: 6,
                boxSizing: 'border-box',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>
          {error && <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'var(--color-mahogany)',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 16,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
