import { useState } from 'react';

export default function CRUDFormServicos({ onSubmit }) {
  const [formData, setFormData] = useState({ nome: '', valor: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!formData.nome || !formData.valor) {
        alert('Preencha todos os campos!');
        return;
      }
      
      await onSubmit(formData.nome, parseFloat(formData.valor));
      setFormData({ nome: '', valor: '' });
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form">
      <div className="form-group">
        <label htmlFor="nome">Nome do Serviço</label>
        <input
          id="nome"
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Ex: Corte"
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label htmlFor="valor">Valor (R$)</label>
        <input
          id="valor"
          type="number"
          name="valor"
          step="0.01"
          value={formData.valor}
          onChange={handleChange}
          placeholder="Ex: 50.00"
          disabled={loading}
        />
      </div>
      <button type="submit" disabled={loading} className="btn-submit">
        {loading ? 'Salvando...' : 'Cadastrar'}
      </button>
    </form>
  );
}
