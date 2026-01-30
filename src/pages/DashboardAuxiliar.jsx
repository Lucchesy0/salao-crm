import { useState, useEffect } from 'react';

export default function DashboardAuxiliar({ user }) {
  const [stats, setStats] = useState({
    clientes: 0,
    servicos: 0
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
        servicos: servicos.length || 0
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
        <h1>Bem-vindo, {user?.nome}!</h1>
        <p>Dashboard do Auxiliar</p>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="stats-grid">
          <StatCard label="Clientes Registrados" value={stats.clientes} color="green" />
          <StatCard label="Serviços Disponíveis" value={stats.servicos} color="blue" />
        </div>
      )}

      <div className="page-header" style={{ marginTop: '40px' }}>
        <h2>Tarefas do Dia</h2>
      </div>
      <div className="empty-state">
        Nenhuma tarefa atribuída
      </div>
    </div>
  );
}
