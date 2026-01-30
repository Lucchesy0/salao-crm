import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    auxiliares: 0,
    cabeleireiras: 0,
    clientes: 0,
    servicos: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarStats();
  }, []);

  const carregarStats = async () => {
    try {
      const res = await fetch('/dashboard');
      const data = await res.json();
      setStats(data);
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
        <h1>Dashboard</h1>
        <p>Visão geral do negócio</p>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="stats-grid">
          <StatCard label="Auxiliares" value={stats.auxiliares} color="blue" />
          <StatCard label="Cabeleireiras" value={stats.cabeleireiras} color="green" />
          <StatCard label="Clientes" value={stats.clientes} color="pink" />
          <StatCard label="Serviços" value={stats.servicos} color="purple" />
        </div>
      )}
    </div>
  );
}
