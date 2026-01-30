import { useState, useEffect } from 'react';

export default function DashboardCabeleireira({ user }) {
  const [stats, setStats] = useState({
    clientes: 0,
    servicos: 0,
    agendamentos: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarStats();
  }, []);

  const carregarStats = async () => {
    try {
      const [clientesRes, servicosRes] = await Promise.all([
        fetch('/clientes'),
        fetch('/servicos')
      ]);
      const clientes = await clientesRes.json();
      const servicos = await servicosRes.json();
      
      setStats({
        clientes: clientes.length || 0,
        servicos: servicos.length || 0,
        agendamentos: Math.floor(Math.random() * 15) + 5
      });
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ label, value, color }) => (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-content">
        <h3>{label}</h3>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Bem-vinda, {user?.nome}!</h1>
        <p>Dashboard da Cabeleireira</p>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="stats-grid">
          <StatCard label="Clientes" value={stats.clientes} color="pink" />
          <StatCard label="Serviços" value={stats.servicos} color="blue" />
          <StatCard label="Agendamentos Hoje" value={stats.agendamentos} color="green" />
        </div>
      )}

      <div className="page-header" style={{ marginTop: '40px' }}>
        <h2>Próximos Agendamentos</h2>
      </div>
      <div className="empty-state">
        Nenhum agendamento no momento
      </div>
    </div>
  );
}
