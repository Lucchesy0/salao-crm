import { useState, useEffect } from 'react';
import CRUDFormRegistros from '../components/CRUDFormRegistros';
import CRUDListRegistros from '../components/CRUDListRegistros';

export default function Registros({ onAdd }) {
  const [items, setItems] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [cabeleireiras, setCabeleireiras] = useState([]);
  const [message, setMessage] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resReg, resClienter, resServ, resCab] = await Promise.all([
        fetch('/registros'),
        fetch('/clientes'),
        fetch('/servicos'),
        fetch('/cabeleireiras')
      ]);
      
      const registros = await resReg.json();
      const clientesData = await resClienter.json();
      const servicosData = await resServ.json();
      const cabeleireirasData = await resCab.json();

      setItems(Array.isArray(registros) ? registros : []);
      setClientes(Array.isArray(clientesData) ? clientesData : []);
      setServicos(Array.isArray(servicosData) ? servicosData : []);
      setCabeleireiras(Array.isArray(cabeleireirasData) ? cabeleireirasData : []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const res = await fetch('/registros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Erro ao cadastrar agendamento');

      const data = await res.json();
      let successText = '✓ Agendamento cadastrado!';
      if (data.codigo_procedimento) successText += ` Código: ${data.codigo_procedimento}`;
      setMessage({ text: successText, type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      carregarDados();
      onAdd();
    } catch (err) {
      setMessage({ text: `Erro: ${err.message}`, type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deletar este agendamento?')) return;
    try {
      const headers = {};
      if (isAdmin) headers['x-user-role'] = user.role;
      const res = await fetch(`/registros/${id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error('Erro ao deletar');
      setMessage({ text: '✓ Agendamento deletado!', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      carregarDados();
    } catch (err) {
      setMessage({ text: `Erro: ${err.message}`, type: 'error' });
    }
  };

  const handleEdit = async (id, formData) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (isAdmin) headers['x-user-role'] = user.role;
      const res = await fetch(`/registros/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Erro ao atualizar agendamento');
      setMessage({ text: '✓ Agendamento atualizado!', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      carregarDados();
    } catch (err) {
      setMessage({ text: `Erro: ${err.message}`, type: 'error' });
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Registros de Agendamentos</h1>
      </div>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="crud-layout">
        <div className="form-section">
          <h2 className="section-title">Novo Agendamento</h2>
          <CRUDFormRegistros 
            onSubmit={handleSubmit}
            clientes={clientes}
            servicos={servicos}
            cabeleireiras={cabeleireiras}
          />
        </div>

        <div className="list-section">
          <h2 className="section-title">Agendamentos</h2>
          <CRUDListRegistros 
            items={items}
            clientes={clientes}
            servicos={servicos}
            cabeleireiras={cabeleireiras}
            onDelete={isAdmin ? handleDelete : undefined}
            onEdit={isAdmin ? handleEdit : undefined}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </div>
  );
}
