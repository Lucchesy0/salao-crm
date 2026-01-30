import { useState, useEffect } from 'react';

export default function Servicos() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [novoServico, setNovoServico] = useState({
    nome: '',
    descricao: '',
    preco: '',
    duracao: ''
  });

  useEffect(() => {
    carregarServicos();
  }, []);

  const carregarServicos = async () => {
    try {
      const res = await fetch('/api/servicos');
      const data = await res.json();
      setServicos(data);
    } catch (err) {
      console.error('Erro ao carregar:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/servicos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoServico)
      });
      
      if (res.ok) {
        alert('Serviço cadastrado com sucesso!');
        setNovoServico({ nome: '', descricao: '', preco: '', duracao: '' });
        setMostrarForm(false);
        carregarServicos();
      } else {
        alert('Erro ao cadastrar serviço');
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao cadastrar');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir este serviço?')) return;
    
    try {
      const res = await fetch(`/api/servicos/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        alert('Serviço excluído com sucesso!');
        carregarServicos();
      } else {
        alert('Erro ao excluir serviço');
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao excluir');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Serviços</h1>
        <button 
          className="btn-primary"
          onClick={() => setMostrarForm(!mostrarForm)}
        >
          {mostrarForm ? 'Cancelar' : '+ Adicionar Serviço'}
        </button>
      </div>

      {mostrarForm && (
        <div className="form-card">
          <h2>Novo Serviço</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome do serviço</label>
              <input
                type="text"
                value={novoServico.nome}
                onChange={(e) => setNovoServico({...novoServico, nome: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <textarea
                value={novoServico.descricao}
                onChange={(e) => setNovoServico({...novoServico, descricao: e.target.value})}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                value={novoServico.preco}
                onChange={(e) => setNovoServico({...novoServico, preco: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Duração (minutos)</label>
              <input
                type="number"
                value={novoServico.duracao}
                onChange={(e) => setNovoServico({...novoServico, duracao: e.target.value})}
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
                <th>Descrição</th>
                <th>Preço</th>
                <th>Duração</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {servicos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">
                    Nenhum serviço cadastrado
                  </td>
                </tr>
              ) : (
                servicos.map((servico) => (
                  <tr key={servico.id}>
                    <td>{servico.nome}</td>
                    <td>{servico.descricao || '-'}</td>
                    <td>R$ {parseFloat(servico.preco).toFixed(2)}</td>
                    <td>{servico.duracao} min</td>
                    <td>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(servico.id)}
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
