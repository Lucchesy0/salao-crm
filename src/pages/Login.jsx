import { useState, useEffect } from 'react';
import { setStoredUser } from '../utils/auth';

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('admin');
  const [senha, setSenha] = useState('123');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const res = await fetch('/auth/users');
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, senha })
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.erro || 'Erro ao fazer login');
        return;
      }

      setStoredUser(data.user);
      onLogin(data.user);
    } catch (err) {
      setErro('Erro ao conectar com o servidor');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (user) => {
    setUsuario(user.usuario);
    setSenha(user.senha);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Salão CRM</h1>
        <p className="login-subtitle">Sistema de Gerenciamento</p>

        {erro && <div className="login-erro">{erro}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="usuario">Usuário</label>
            <input
              id="usuario"
              type="text"
              placeholder="Digite o usuário"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="Digite a senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-demo">
          <p className="demo-title">Contas de Teste (senha: 123):</p>
          <div className="quick-login">
            {usuarios.map(user => (
              <button
                key={user.usuario}
                type="button"
                className="quick-login-btn"
                onClick={() => handleQuickLogin(user)}
              >
                <strong>{user.nome}</strong>
                <small>@{user.usuario}</small>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

