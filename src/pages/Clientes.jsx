import { useState, useEffect } from 'react';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [novoCliente, setNovoCliente] = useState({
    nome: '',
    telefone: '',
    email: '',
    senha: ''
  });

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      const res = await fetch('/api/clientes');
      const data = await res.json();
      setClientes(data);
    } catch (err) {
      console.error('Erro ao carregar:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoCliente)
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
        alert('Cliente cadastrado com sucesso!');
        setNovoCliente({ nome: '', telefone: '', email: '', senha: '' });
        setMostrarForm(false);
        carregarClientes();
      } else {
        alert('Erro ao cadastrar cliente');
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
      
      const res = await fetch(`/clientes/${id}`, {
        method: 'DELETE',
        headers
      });

      if (!res.ok) throw new Error('Erro ao deletar');

      setMessage({ text: '✓ Cliente deletado com sucesso!', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      carregarItens();
      onAdd();
    } catch (err) {
      setMessage({ text: `✗ Erro ao deletar: ${err.message}`, type: 'error' });
      setTimeout(() => setMessage(null), 3000);
=======
    if (!confirm('Deseja realmente excluir este cliente?')) return;
    
    try {
      const res = await fetch(`/api/clientes/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        alert('Cliente excluído com sucesso!');
        carregarClientes();
      } else {
        alert('Erro ao excluir cliente');
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
        <h1>Clientes</h1>
<<<<<<< HEAD
        <p>Gerencie os clientes do salão</p>
      </div>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="crud-layout">
        {isAdmin && (
          <div className="form-section">
            <h2 className="section-title">Novo Cliente</h2>
            <CRUDForm fields={[{ name: 'nome', label: 'Nome', type: 'text' }]} onSubmit={handleSubmit} />
          </div>
        )}

        <div className="list-section">
          <h2 className="section-title">Lista de Clientes</h2>
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
          {mostrarForm ? 'Cancelar' : '+ Adicionar Cliente'}
        </button>
      </div>

      {mostrarForm && (
        <div className="form-card">
          <h2>Novo Cliente</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome completo</label>
              <input
                type="text"
                value={novoCliente.nome}
                onChange={(e) => setNovoCliente({...novoCliente, nome: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input
                type="tel"
                value={novoCliente.telefone}
                onChange={(e) => setNovoCliente({...novoCliente, telefone: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                value={novoCliente.email}
                onChange={(e) => setNovoCliente({...novoCliente, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                value={novoCliente.senha}
                onChange={(e) => setNovoCliente({...novoCliente, senha: e.target.value})}
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
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state">
                    Nenhum cliente cadastrado
                  </td>
                </tr>
              ) : (
                clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.nome}</td>
                    <td>{cliente.telefone}</td>
                    <td>{cliente.email}</td>
                    <td>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(cliente.id)}
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
