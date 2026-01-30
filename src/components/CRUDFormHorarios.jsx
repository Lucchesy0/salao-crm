import { useState } from 'react';

export default function CRUDFormHorarios({ onSubmit }) {
  const [hora_inicio, setHoraInicio] = useState('09:00');
  const [hora_fim, setHoraFim] = useState('17:00');
  const [dias_semana, setDiasSemana] = useState('Segunda a Sexta');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hora_inicio && hora_fim) {
      onSubmit(hora_inicio, hora_fim, dias_semana);
      setHoraInicio('09:00');
      setHoraFim('17:00');
      setDiasSemana('Segunda a Sexta');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form">
      <div className="form-group">
        <label htmlFor="hora_inicio">Hora Inicial</label>
        <input
          id="hora_inicio"
          type="time"
          value={hora_inicio}
          onChange={(e) => setHoraInicio(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="hora_fim">Hora Final</label>
        <input
          id="hora_fim"
          type="time"
          value={hora_fim}
          onChange={(e) => setHoraFim(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="dias_semana">Dias da Semana</label>
        <input
          id="dias_semana"
          type="text"
          value={dias_semana}
          onChange={(e) => setDiasSemana(e.target.value)}
          placeholder="Ex: Segunda a Sexta"
        />
      </div>

      <button type="submit" className="btn btn-primary">Cadastrar Horário</button>
    </form>
  );
}
