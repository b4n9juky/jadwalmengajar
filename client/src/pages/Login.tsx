import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal');
    }
    setSubmitting(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f1f5f9',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        padding: '2.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,.1)',
        width: '100%',
        maxWidth: 360,
      }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.25rem' }}>
          JadwalAuto
        </h1>
        <p style={{ fontSize: '.8125rem', color: '#64748b', textAlign: 'center', marginBottom: '1.5rem' }}>
          Masuk ke sistem penjadwalan
        </p>

        {error && (
          <div style={{
            background: '#fef2f2',
            color: '#dc2626',
            padding: '.5rem .75rem',
            borderRadius: '.25rem',
            fontSize: '.8125rem',
            marginBottom: '1rem',
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '.8125rem', fontWeight: 500, marginBottom: '.25rem' }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
            style={{
              width: '100%',
              padding: '.5rem .75rem',
              border: '1px solid #cbd5e1',
              borderRadius: '.25rem',
              fontSize: '.875rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '.8125rem', fontWeight: 500, marginBottom: '.25rem' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '.5rem .75rem',
              border: '1px solid #cbd5e1',
              borderRadius: '.25rem',
              fontSize: '.875rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
          style={{ width: '100%', padding: '.625rem', fontSize: '.875rem' }}
        >
          {submitting ? 'Masuk...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}
