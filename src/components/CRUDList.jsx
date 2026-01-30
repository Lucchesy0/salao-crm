export default function CRUDList({ items, showValor = false }) {
  if (!items || items.length === 0) {
    return <div className="empty-state">Nenhum item cadastrado</div>;
  }

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
          <span className="item-id">#{item.id}</span>
        </div>
      ))}
    </div>
  );
}
