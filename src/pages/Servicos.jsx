import { useState, useEffect } from 'react';
import CRUDFormServicos from '../components/CRUDFormServicos';
import CRUDList from '../components/CRUDList';

export default function Servicos({ onAdd }) {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    carregarItens();
  }, []);

  const carregarItens = async () => {
    try {
      const res = await fetch('/servicos');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  const handleSubmit = async (nome, valor) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (isAdmin) headers['x-user-role'] = user.role;
      const res = await fetch('/servicos', {
        method: 'POST',
        headers,
        body: JSON.stringify({ nome, valor })
      });

      if (!res.ok) throw new Error('Erro ao cadastrar');

      const newItem = await res.json();
      setMessage({ text: `✓ "${newItem.nome}" cadastrado!`, type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      carregarItens();
      onAdd();
    } catch (err) {
      setMessage({ text: `Erro: ${err.message}`, type: 'error' });
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Serviços</h1>
      </div>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="crud-layout">
        {isAdmin && (
          <div className="form-section">
            <h2 className="section-title">Novo Serviço</h2>
            <CRUDFormServicos onSubmit={handleSubmit} />
          </div>
        )}

        <div className="list-section">
          <h2 className="section-title">Lista</h2>
          <CRUDList items={items} showValor={true} />
        </div>
      </div>
    </div>
  );
}
