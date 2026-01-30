import { useState, useEffect } from 'react';

export default function Auxiliares() {
  const [auxiliares, setAuxiliares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [novoAuxiliar, setNovoAuxiliar] = useState({
    nome: '',
    telefone: '',
    email: '',
    senha: ''
  });

  useEffect(() => {
    carregarAuxiliares();
  }, []);

  const carregarAuxiliares = async () => {
    try {
      const res = await fetch('/api/auxiliares');
      const data = await res.json();
      setAuxiliares(data);
    } catch (err) {
      console.error('Erro ao carregar:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auxiliares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoAuxiliar)
      });
      
      if (res.ok) {
        alert('Auxiliar cadastrado com sucesso!');
        setNovoAuxiliar({ nome: '', telefone: '', email: '', senha: '' });
        setMostrarForm(false);
        carregarAuxiliares();
      } else {
        alert('Erro ao cadastrar auxiliar');
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao cadastrar');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir este auxiliar?')) return;
    
    try {
      const res = await fetch(`/api/auxiliares/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        alert('Auxiliar excluído com sucesso!');
        carregarAuxiliares();
      } else {
        alert('Erro ao excluir auxiliar');
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao excluir');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Auxiliares</h1>
        <button 
          className="btn-primary"
          onClick={() => setMostrarForm(!mostrarForm)}
        >
          {mostrarForm ? 'Cancelar' : '+ Adicionar Auxiliar'}
        </button>
      </div>

      {mostrarForm && (
        <div className="form-card">
          <h2>Novo Auxiliar</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome completo</label>
              <input
                type="text"
                value={novoAuxiliar.nome}
                onChange={(e) => setNovoAuxiliar({...novoAuxiliar, nome: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input
                type="tel"
                value={novoAuxiliar.telefone}
                onChange={(e) => setNovoAuxiliar({...novoAuxiliar, telefone: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                value={novoAuxiliar.email}
                onChange={(e) => setNovoAuxiliar({...novoAuxiliar, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                value={novoAuxiliar.senha}
                onChange={(e) => setNovoAuxiliar({...novoAuxiliar, senha: e.target.value})}
                required
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
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {auxiliares.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state">
                    Nenhum auxiliar cadastrado
                  </td>
                </tr>
              ) : (
                auxiliares.map((aux) => (
                  <tr key={aux.id}>
                    <td>{aux.nome}</td>
                    <td>{aux.telefone}</td>
                    <td>{aux.email}</td>
                    <td>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(aux.id)}
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
