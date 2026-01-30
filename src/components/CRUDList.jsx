export default function CRUDList({ items, showValor = false, onDelete, userRole }) {
  if (!items || items.length === 0) {
    return <div className="empty-state">Nenhum item cadastrado</div>;
  }

  const canDelete = userRole === 'admin' && onDelete;

  return (
    <div className="crud-list">
      {items.map(item => (
        <div key={item.id} className="crud-item">
          <div className="item-content">
            <h4>{item.nome}</h4>
            {showValor && item.valor && (
              <p className="item-valor">
                R$ {parseFloat(item.valor).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            )}
          </div>
          <div className="item-actions">
            <span className="item-id">#{item.id}</span>
            {canDelete && (
              <button
                className="btn-delete"
                onClick={() => {
                  if (window.confirm(`Tem certeza que deseja deletar "${item.nome}"?`)) {
                    onDelete(item.id);
                  }
                }}
                title="Deletar"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}