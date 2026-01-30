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
    }
  };

  const handleDelete = async (id) => {
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
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Clientes</h1>
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
