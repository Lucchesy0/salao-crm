import { useState } from 'react';

export default function CRUDListHorarios({ items, onDelete, onEdit, isAdmin }) {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEditStart = (item) => {
    setEditId(item.id);
    setEditData({
      hora_inicio: item.hora_inicio,
      hora_fim: item.hora_fim,
      dias_semana: item.dias_semana
    });
  };

  const handleEditSave = (id) => {
    onEdit(id, editData.hora_inicio, editData.hora_fim, editData.dias_semana);
    setEditId(null);
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="crud-list">
      {items.length === 0 ? (
        <p className="empty-message">Nenhum horário cadastrado</p>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item.id} className="list-item">
              {editId === item.id ? (
                <div className="edit-mode">
                  <input
                    type="time"
                    value={editData.hora_inicio}
                    onChange={(e) => handleEditChange('hora_inicio', e.target.value)}
                  />
                  <span> até </span>
                  <input
                    type="time"
                    value={editData.hora_fim}
                    onChange={(e) => handleEditChange('hora_fim', e.target.value)}
                  />
                  <input
                    type="text"
                    value={editData.dias_semana}
                    onChange={(e) => handleEditChange('dias_semana', e.target.value)}
                    placeholder="Dias"
                  />
                  <button onClick={() => handleEditSave(item.id)} className="btn-save">Salvar</button>
                  <button onClick={() => setEditId(null)} className="btn-cancel">Cancelar</button>
                </div>
              ) : (
                <div className="view-mode">
                  <strong>{item.hora_inicio} - {item.hora_fim}</strong>
                  <span className="text-secondary">{item.dias_semana}</span>
                  {isAdmin && <button onClick={() => handleEditStart(item)} className="btn-edit">Editar</button>}
                  {isAdmin && onDelete && <button onClick={() => onDelete(item.id)} className="btn-delete">Deletar</button>}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
