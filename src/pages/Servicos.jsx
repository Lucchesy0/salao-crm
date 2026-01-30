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
<<<<<<< HEAD

      if (!res.ok) throw new Error('Erro ao cadastrar');

      const newItem = await res.json();
      setMessage({ text: `✓ "${newItem.nome}" cadastrado com sucesso!`, type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      carregarItens();
      onAdd();
    } catch (err) {
      setMessage({ text: `✗ Erro: ${err.message}`, type: 'error' });
      setTimeout(() => setMessage(null), 3000);
=======
      
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
>>>>>>> c1c10b5f9828ffa2b4c6fc9658291a293e16eb78
    }
  };

  const handleDelete = async (id) => {
<<<<<<< HEAD
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (isAdmin) headers['x-user-role'] = user.role;
      
      const res = await fetch(`/servicos/${id}`, {
        method: 'DELETE',
        headers
      });

      if (!res.ok) throw new Error('Erro ao deletar');

      setMessage({ text: '✓ Serviço deletado com sucesso!', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      carregarItens();
      onAdd();
    } catch (err) {
      setMessage({ text: `✗ Erro ao deletar: ${err.message}`, type: 'error' });
      setTimeout(() => setMessage(null), 3000);
=======
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
>>>>>>> c1c10b5f9828ffa2b4c6fc9658291a293e16eb78
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Serviços</h1>
<<<<<<< HEAD
        <p>Gerencie os serviços oferecidos pelo salão</p>
      </div>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="crud-layout">
        {isAdmin && (
          <div className="form-section">
            <h2 className="section-title">Novo Serviço</h2>
            <CRUDFormServicos onSubmit={handleSubmit} />
          </div>
        )}

        <div className="list-section">
          <h2 className="section-title">Lista de Serviços</h2>
          <CRUDList 
            items={items} 
            showValor={true}
            userRole={user?.role}
            onDelete={handleDelete}
          />
=======
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
>>>>>>> c1c10b5f9828ffa2b4c6fc9658291a293e16eb78
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
