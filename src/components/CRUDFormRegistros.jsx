import { useState } from 'react';

export default function CRUDFormRegistros({ onSubmit, clientes, servicos, cabeleireiras }) {
  const [formData, setFormData] = useState({
    horario_agendamento: '',
    cliente_id: '',
    servico_id: '',
    cabeleireira_id: '',
    observacoes: '',
    status: 'agendado'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.horario_agendamento && formData.cliente_id) {
      onSubmit({
        ...formData,
        cliente_id: Number(formData.cliente_id),
        servico_id: formData.servico_id ? Number(formData.servico_id) : null,
        cabeleireira_id: formData.cabeleireira_id ? Number(formData.cabeleireira_id) : null
      });
      setFormData({
        horario_agendamento: '',
        cliente_id: '',
        servico_id: '',
        cabeleireira_id: '',
        observacoes: '',
        status: 'agendado'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form">
      <div className="form-group">
        <label htmlFor="horario_agendamento">Data e Hora</label>
        <input
          id="horario_agendamento"
          type="datetime-local"
          name="horario_agendamento"
          value={formData.horario_agendamento}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="cliente_id">Cliente</label>
        <select
          id="cliente_id"
          name="cliente_id"
          value={formData.cliente_id}
          onChange={handleChange}
          required
        >
          <option value="">Selecione um cliente</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="servico_id">Serviço</label>
        <select
          id="servico_id"
          name="servico_id"
          value={formData.servico_id}
          onChange={handleChange}
        >
          <option value="">Selecione um serviço</option>
          {servicos.map(s => (
            <option key={s.id} value={s.id}>{s.nome} - R$ {s.valor}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="cabeleireira_id">Cabeleireira</label>
        <select
          id="cabeleireira_id"
          name="cabeleireira_id"
          value={formData.cabeleireira_id}
          onChange={handleChange}
        >
          <option value="">Selecione uma cabeleireira</option>
          {cabeleireiras.map(c => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="observacoes">Observações</label>
        <textarea
          id="observacoes"
          name="observacoes"
          value={formData.observacoes}
          onChange={handleChange}
          placeholder="Notas adicionais"
          rows="3"
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="agendado">Agendado</option>
          <option value="confirmado">Confirmado</option>
          <option value="cancelado">Cancelado</option>
          <option value="concluido">Concluído</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary">Agendar</button>
    </form>
  );
}
