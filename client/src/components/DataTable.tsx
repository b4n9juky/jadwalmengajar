interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns, data, keyExtractor, onEdit, onDelete, emptyMessage,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="data-table-wrapper">
        <div className="empty-state">
          <p>{emptyMessage || 'Tidak ada data'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)}>{col.header}</th>
            ))}
            {(onEdit || onDelete) && <th style={{ width: 80 }}></th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={keyExtractor(item)}>
              {columns.map((col) => (
                <td key={String(col.key)} className={col.className || ''}>
                  {col.render ? col.render(item) : String(item[col.key as keyof T] ?? '')}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="actions">
                  {onEdit && (
                    <button className="btn-icon" title="Edit" onClick={() => onEdit(item)}>
                      ✏️
                    </button>
                  )}
                  {onDelete && (
                    <button className="btn-icon" title="Hapus" onClick={() => onDelete(item)}>
                      🗑️
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
