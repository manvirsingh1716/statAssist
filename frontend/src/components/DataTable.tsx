interface DataTableProps {
  rows: Record<string, string | number | null>[]
}

export function DataTable({ rows }: DataTableProps) {
  if (!rows.length) {
    return <p className="muted">No preview rows available yet.</p>
  }

  const columns = Object.keys(rows[0])

  return (
    <div className="table-wrapper">
      <p className="table-meta">Previewing {rows.length} sample rows</p>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {columns.map((column) => (
                <td key={`${rowIndex}-${column}`}>{String(row[column] ?? '-')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
