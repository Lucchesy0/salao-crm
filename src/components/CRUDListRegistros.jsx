import { useState } from 'react';

export default function CRUDListRegistros({ items, clientes, servicos, cabeleireiras, onDelete, onEdit, isAdmin }) {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const getClienteName = (id) => clientes.find(c => c.id === id)?.nome || 'N/A';
  const getServicoName = (id) => servicos.find(s => s.id === id)?.nome || 'N/A';
  const getCabeleireiraNome = (id) => cabeleireiras.find(c => c.id === id)?.nome || 'N/A';

  const handleEditStart = (item) => {
    setEditId(item.id);
    setEditData({
      horario_agendamento: item.horario_agendamento,
      cliente_id: item.cliente_id,
      servico_id: item.servico_id,
      cabeleireira_id: item.cabeleireira_id,
      observacoes: item.observacoes,
      status: item.status
    });
  };

  const handleEditSave = (id) => {
    onEdit(id, {
      ...editData,
      cliente_id: Number(editData.cliente_id),
      servico_id: editData.servico_id ? Number(editData.servico_id) : null,
      cabeleireira_id: editData.cabeleireira_id ? Number(editData.cabeleireira_id) : null
    });
    setEditId(null);
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  return (
    <div className="crud-list">
      {items.length === 0 ? (
        <p className="empty-message">Nenhum agendamento cadastrado</p>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item.id} className="list-item">
              {editId === item.id ? (
                <div className="edit-mode">
                  <div>
                    <label>Data/Hora:</label>
                    <input
                      type="datetime-local"
                      value={editData.horario_agendamento}
                      onChange={(e) => handleEditChange('horario_agendamento', e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Cliente:</label>
                    <select value={editData.cliente_id} onChange={(e) => handleEditChange('cliente_id', e.target.value)}>
                      {clientes.map(c => (
                        <option key={c.id} value={c.id}>{c.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Status:</label>
                    <select value={editData.status} onChange={(e) => handleEditChange('status', e.target.value)}>
                      <option value="agendado">Agendado</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="cancelado">Cancelado</option>
                      <option value="concluido">Concluído</option>
                    </select>
                  </div>
                  <button onClick={() => handleEditSave(item.id)} className="btn-save">Salvar</button>
                  <button onClick={() => setEditId(null)} className="btn-cancel">Cancelar</button>
                </div>
              ) : (
                <div className="view-mode">
                  <div>
                    <strong>{formatDate(item.horario_agendamento)}</strong>
                    <div className="small-row">
                      <span className="text-secondary">Cliente: {getClienteName(item.cliente_id)}</span>
                      <span className="text-secondary">Serviço: {getServicoName(item.servico_id)}</span>
                      <span className="text-secondary">Cabeleireira: {getCabeleireiraNome(item.cabeleireira_id)}</span>
                    </div>
                    <div className="small-row">
                      <span className={`status-badge status-${item.status}`}>{item.status}</span>
                      {item.codigo_procedimento && <span className="code-badge">Código: {item.codigo_procedimento}</span>}
                    </div>
                  </div>
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
