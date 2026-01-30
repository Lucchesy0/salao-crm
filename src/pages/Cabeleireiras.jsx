import { useState, useEffect } from 'react';

export default function Cabeleireiras() {
  const [cabeleireiras, setCabeleireiras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [novaCabeleireira, setNovaCabeleireira] = useState({
    nome: '',
    telefone: '',
    email: '',
    senha: '',
    especialidade: ''
  });

  useEffect(() => {
    carregarCabeleireiras();
  }, []);

  const carregarCabeleireiras = async () => {
    try {
      const res = await fetch('/api/cabeleireiras');
      const data = await res.json();
      setCabeleireiras(data);
    } catch (err) {
      console.error('Erro ao carregar:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/cabeleireiras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaCabeleireira)
      });
      
      if (res.ok) {
        alert('Cabeleireira cadastrada com sucesso!');
        setNovaCabeleireira({ nome: '', telefone: '', email: '', senha: '', especialidade: '' });
        setMostrarForm(false);
        carregarCabeleireiras();
      } else {
        alert('Erro ao cadastrar cabeleireira');
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao cadastrar');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir esta cabeleireira?')) return;
    
    try {
      const res = await fetch(`/api/cabeleireiras/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        alert('Cabeleireira excluída com sucesso!');
        carregarCabeleireiras();
      } else {
        alert('Erro ao excluir cabeleireira');
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao excluir');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Cabeleireiras</h1>
        <button 
          className="btn-primary"
          onClick={() => setMostrarForm(!mostrarForm)}
        >
          {mostrarForm ? 'Cancelar' : '+ Adicionar Cabeleireira'}
        </button>
      </div>

      {mostrarForm && (
        <div className="form-card">
          <h2>Nova Cabeleireira</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome completo</label>
              <input
                type="text"
                value={novaCabeleireira.nome}
                onChange={(e) => setNovaCabeleireira({...novaCabeleireira, nome: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input
                type="tel"
                value={novaCabeleireira.telefone}
                onChange={(e) => setNovaCabeleireira({...novaCabeleireira, telefone: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                value={novaCabeleireira.email}
                onChange={(e) => setNovaCabeleireira({...novaCabeleireira, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                value={novaCabeleireira.senha}
                onChange={(e) => setNovaCabeleireira({...novaCabeleireira, senha: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Especialidade</label>
              <input
                type="text"
                value={novaCabeleireira.especialidade}
                onChange={(e) => setNovaCabeleireira({...novaCabeleireira, especialidade: e.target.value})}
                placeholder="Ex: Cortes, Coloração, Penteados"
              />
            </div>
            <button type="submit" className="btn-primary">Cadastrar</button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>E-mail</th>
                <th>Especialidade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {cabeleireiras.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">
                    Nenhuma cabeleireira cadastrada
                  </td>
                </tr>
              ) : (
                cabeleireiras.map((cab) => (
                  <tr key={cab.id}>
                    <td>{cab.nome}</td>
                    <td>{cab.telefone}</td>
                    <td>{cab.email}</td>
                    <td>{cab.especialidade || '-'}</td>
                    <td>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(cab.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
