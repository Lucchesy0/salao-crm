import { useState, useEffect } from 'react';
import CRUDFormHorarios from '../components/CRUDFormHorarios';
import CRUDListHorarios from '../components/CRUDListHorarios';

export default function Horarios({ onAdd }) {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    carregarItens();
  }, []);

  const carregarItens = async () => {
    try {
      const res = await fetch('/horarios');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  const handleSubmit = async (hora_inicio, hora_fim, dias_semana) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (isAdmin) headers['x-user-role'] = user.role;
      const res = await fetch('/horarios', {
        method: 'POST',
        headers,
        body: JSON.stringify({ hora_inicio, hora_fim, dias_semana, ativo: true })
      });

      if (!res.ok) throw new Error('Erro ao cadastrar');

      const newItem = await res.json();
      setMessage({ text: `✓ Horário ${newItem.hora_inicio} cadastrado!`, type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      carregarItens();
      onAdd();
    } catch (err) {
      setMessage({ text: `Erro: ${err.message}`, type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deletar este horário?')) return;
    try {
      const headers = {};
      if (isAdmin) headers['x-user-role'] = user.role;
      const res = await fetch(`/horarios/${id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error('Erro ao deletar');
      setMessage({ text: '✓ Horário deletado!', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      carregarItens();
    } catch (err) {
      setMessage({ text: `Erro: ${err.message}`, type: 'error' });
    }
  };

  const handleEdit = async (id, hora_inicio, hora_fim, dias_semana) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (isAdmin) headers['x-user-role'] = user.role;
      const res = await fetch(`/horarios/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ hora_inicio, hora_fim, dias_semana, ativo: true })
      });
      if (!res.ok) throw new Error('Erro ao atualizar');
      setMessage({ text: '✓ Horário atualizado!', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      carregarItens();
    } catch (err) {
      setMessage({ text: `Erro: ${err.message}`, type: 'error' });
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Horários de Atendimento</h1>
      </div>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="crud-layout">
        {isAdmin && (
          <div className="form-section">
            <h2 className="section-title">Novo Horário</h2>
            <CRUDFormHorarios onSubmit={handleSubmit} />
          </div>
        )}

        <div className="list-section">
          <h2 className="section-title">Horários Cadastrados</h2>
          <CRUDListHorarios items={items} onDelete={isAdmin ? handleDelete : undefined} onEdit={isAdmin ? handleEdit : undefined} isAdmin={isAdmin} />
        </div>
      </div>
    </div>
  );
}
