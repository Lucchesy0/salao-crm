import { useState, useEffect } from 'react';

export default function DashboardCliente({ user }) {
  const [perfil, setPerfil] = useState({
    nome: user?.nome || 'Cliente',
    email: 'cliente@example.com',
    telefone: '(11) 9999-9999',
    dataCadastro: new Date().toLocaleDateString('pt-BR'),
    agendamentos: 0
  });

  const StatCard = ({ label, value }) => (
    <div className="stat-card stat-blue">
      <div className="stat-content">
        <h3>{label}</h3>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Meu Perfil</h1>
        <p>Informações da sua conta</p>
      </div>

      <div className="perfil-card">
        <div className="perfil-section">
          <h2>Dados Pessoais</h2>
          <div className="perfil-grid">
            <div className="perfil-field">
              <label>Nome</label>
              <p>{perfil.nome}</p>
            </div>
            <div className="perfil-field">
              <label>Email</label>
              <p>{perfil.email}</p>
            </div>
            <div className="perfil-field">
              <label>Telefone</label>
              <p>{perfil.telefone}</p>
            </div>
            <div className="perfil-field">
              <label>Membro desde</label>
              <p>{perfil.dataCadastro}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="page-header" style={{ marginTop: '40px' }}>
        <h2>Resumo de Atividades</h2>
      </div>

      <div className="stats-grid">
        <StatCard label="Agendamentos" value={perfil.agendamentos} />
        <StatCard label="Serviços Realizados" value="0" />
      </div>

      <div className="page-header" style={{ marginTop: '40px' }}>
        <h2>Agendamentos</h2>
      </div>
      <div className="search-code">
        <p>Possui um código de procedimento? Digite abaixo para visualizar seu agendamento:</p>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input id="procCode" placeholder="Código do procedimento" />
          <button className="btn" onClick={async () => {
            const code = document.getElementById('procCode').value.trim();
            if (!code) return alert('Informe o código');
            try {
              const res = await fetch(`/registros/code/${code}`);
              if (!res.ok) return alert('Código não encontrado');
              const data = await res.json();
              alert(`Agendamento: ${new Date(data.horario_agendamento).toLocaleString('pt-BR')}\nServiço ID: ${data.servico_id}\nStatus: ${data.status}`);
            } catch (err) {
              alert('Erro ao buscar código');
            }
          }}>Buscar</button>
        </div>
      </div>
    </div>
  );
}
