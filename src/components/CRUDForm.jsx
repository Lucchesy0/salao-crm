import { useState } from 'react';

export default function CRUDForm({ fields, onSubmit }) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const values = fields.map(field => formData[field.name] || '');
      if (values.some(v => !v)) {
        alert('Preencha todos os campos!');
        return;
      }
      
      await onSubmit(...values);
      setFormData({});
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form">
      {fields.map(field => (
        <div key={field.name} className="form-group">
          <label htmlFor={field.name}>{field.label}</label>
          <input
            id={field.name}
            type={field.type || 'text'}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            placeholder={field.label}
            disabled={loading}
          />
        </div>
      ))}
      <button type="submit" disabled={loading} className="btn-submit">
        {loading ? 'Salvando...' : 'Cadastrar'}
      </button>
    </form>
  );
}
