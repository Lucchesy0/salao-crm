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
      setMessage({ text: `✓ "${newItem.nome}" cadastrado com sucesso!`, type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      carregarItens();
      onAdd();
    } catch (err) {
      setMessage({ text: `✗ Erro: ${err.message}`, type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (isAdmin) headers['x-user-role'] = user.role;
      
      const res = await fetch(`/servicos/${id}`, {
        method: 'DELETE',
        headers
      });

      if (!res.ok) throw new Error('Erro ao deletar');

      setMessage({ text: '✓ Serviço deletado com sucesso!', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      carregarItens();
      onAdd();
    } catch (err) {
      setMessage({ text: `✗ Erro ao deletar: ${err.message}`, type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Serviços</h1>
        <p>Gerencie os serviços oferecidos pelo salão</p>
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
          <h2 className="section-title">Lista de Serviços</h2>
          <CRUDList 
            items={items} 
            showValor={true}
            userRole={user?.role}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
