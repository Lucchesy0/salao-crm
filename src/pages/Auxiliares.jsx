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
>>>>>>> c1c10b5f9828ffa2b4c6fc9658291a293e16eb78
    }
  };

  const handleDelete = async (id) => {
<<<<<<< HEAD
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (isAdmin) headers['x-user-role'] = user.role;
      
      const res = await fetch(`/auxiliares/${id}`, {
        method: 'DELETE',
        headers
      });

      if (!res.ok) throw new Error('Erro ao deletar');

      setMessage({ text: '✓ Auxiliar deletado com sucesso!', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      carregarItens();
      onAdd();
    } catch (err) {
      setMessage({ text: `✗ Erro ao deletar: ${err.message}`, type: 'error' });
      setTimeout(() => setMessage(null), 3000);
=======
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
>>>>>>> c1c10b5f9828ffa2b4c6fc9658291a293e16eb78
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Auxiliares</h1>
<<<<<<< HEAD
        <p>Gerencie os auxiliares do salão</p>
      </div>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="crud-layout">
        {isAdmin && (
          <div className="form-section">
            <h2 className="section-title">Novo Auxiliar</h2>
            <CRUDForm fields={[{ name: 'nome', label: 'Nome', type: 'text' }]} onSubmit={handleSubmit} />
          </div>
        )}

        <div className="list-section">
          <h2 className="section-title">Lista de Auxiliares</h2>
          <CRUDList 
            items={items} 
            userRole={user?.role}
            onDelete={handleDelete}
          />
=======
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
