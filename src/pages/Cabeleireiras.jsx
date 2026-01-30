import { useState, useEffect } from 'react';
import CRUDForm from '../components/CRUDForm';
import CRUDList from '../components/CRUDList';

export default function Cabeleireiras({ onAdd }) {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    carregarItens();
  }, []);

  const carregarItens = async () => {
    try {
      const res = await fetch('/cabeleireiras');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  const handleSubmit = async (nome) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (isAdmin) headers['x-user-role'] = user.role;
      const res = await fetch('/cabeleireiras', {
        method: 'POST',
        headers,
        body: JSON.stringify({ nome })
      });

      if (!res.ok) throw new Error('Erro ao cadastrar');

      const newItem = await res.json();
      setMessage({ text: `✓ "${newItem.nome}" cadastrada!`, type: 'success' });
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
        <h1>Cabeleireiras</h1>
      </div>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="crud-layout">
        {isAdmin && (
          <div className="form-section">
            <h2 className="section-title">Nova Cabeleireira</h2>
            <CRUDForm fields={[{ name: 'nome', label: 'Nome', type: 'text' }]} onSubmit={handleSubmit} />
          </div>
        )}

        <div className="list-section">
          <h2 className="section-title">Lista</h2>
          <CRUDList items={items} />
        </div>
      </div>
    </div>
  );
}
