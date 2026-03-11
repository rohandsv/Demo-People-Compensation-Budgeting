import React, { useState } from 'react';
import './DataTable.css';

const DataTable = ({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No data found',
  stickyHeader = false,
  compact = false,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, dir: 'asc' });

  const handleSort = (key) => {
    if (!key) return;
    setSortConfig(prev => ({
      key,
      dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.dir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return sortConfig.dir === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [data, sortConfig]);

  return (
    <div className={`data-table-wrap ${stickyHeader ? 'sticky-header' : ''}`}>
      <table className={`data-table ${compact ? 'compact' : ''}`}>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key || col.label}
                className={`${col.sortable !== false ? 'sortable' : ''} ${col.align === 'right' ? 'text-right' : ''} ${col.align === 'center' ? 'text-center' : ''}`}
                style={{ width: col.width }}
                onClick={() => col.sortable !== false && handleSort(col.key)}
              >
                <div className="th-inner">
                  <span>{col.label}</span>
                  {col.sortable !== false && (
                    <span className={`sort-icon ${sortConfig.key === col.key ? `sorted-${sortConfig.dir}` : ''}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
                      </svg>
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty-row">
                <div className="empty-state">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h4"/>
                  </svg>
                  <p>{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : sortedData.map((row, rIdx) => (
            <tr
              key={row.id || rIdx}
              className={`${onRowClick ? 'clickable-row' : ''} ${row._rowClass || ''}`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map(col => (
                <td
                  key={col.key || col.label}
                  className={`${col.align === 'right' ? 'text-right' : ''} ${col.align === 'center' ? 'text-center' : ''}`}
                >
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
