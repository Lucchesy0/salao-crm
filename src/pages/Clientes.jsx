import { useState, useEffect } from 'react';
import CRUDForm from '../components/CRUDForm';
import CRUDList from '../components/CRUDList';

export default function Clientes({ onAdd }) {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    carregarItens();
  }, []);

  const carregarItens = async () => {
    try {
      const res = await fetch('/clientes');
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
      const res = await fetch('/clientes', {
        method: 'POST',
        headers,
        body: JSON.stringify({ nome })
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
      
      const res = await fetch(`/clientes/${id}`, {
        method: 'DELETE',
        headers
      });

      if (!res.ok) throw new Error('Erro ao deletar');

      setMessage({ text: '✓ Cliente deletado com sucesso!', type: 'success' });
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
        <h1>Clientes</h1>
        <p>Gerencie os clientes do salão</p>
      </div>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="crud-layout">
        {isAdmin && (
          <div className="form-section">
            <h2 className="section-title">Novo Cliente</h2>
            <CRUDForm fields={[{ name: 'nome', label: 'Nome', type: 'text' }]} onSubmit={handleSubmit} />
          </div>
        )}

        <div className="list-section">
          <h2 className="section-title">Lista de Clientes</h2>
          <CRUDList 
            items={items}
            userRole={user?.role}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
