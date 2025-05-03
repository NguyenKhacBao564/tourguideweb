// src/components/Admin/adminDataTable.js
import React from 'react';
import PropTypes from 'prop-types';
import PaginationBar from '../Common/Pagination/PaginationBar';

const AdminDataTable = ({
  columns,
  data,
  loading,
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,

  // rowSelection: {
  //   selectedRowKeys: [],      // array of keys (emp_id, tour_id, ...)
  //   onChange: (newSelectedKeys) => {}, 
  // }
  rowSelection
}) => {
  if (loading) return <p>Loading…</p>;

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasSelection = !!rowSelection;

  // Checkbox trong header để chọn/bỏ chọn tất cả
  const onSelectAll = (e) => {
    if (e.target.checked) {
      const allKeys = data.map(r => r[columns[0].accessor]);
      rowSelection.onChange(allKeys);
    } else {
      rowSelection.onChange([]);
    }
  };

  return (
    <div>
      <table className="table table-striped">
        <thead>
          <tr>
            {hasSelection && (
              <th style={{ width: 50 }}>
                <input
                  type="checkbox"
                  checked={rowSelection.selectedRowKeys.length === data.length}
                  onChange={onSelectAll}
                />
              </th>
            )}
            {columns.map(col => (
              <th key={col.accessor}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => {
            const rowKey = row[columns[0].accessor];
            return (
              <tr key={rowKey}>
                {hasSelection && (
                  <td>
                    <input
                      type="checkbox"
                      checked={rowSelection.selectedRowKeys.includes(rowKey)}
                      onChange={() => {
                        const { selectedRowKeys, onChange } = rowSelection;
                        const idx = selectedRowKeys.indexOf(rowKey);
                        if (idx >= 0) {
                          onChange(selectedRowKeys.filter(k => k !== rowKey));
                        } else {
                          onChange([...selectedRowKeys, rowKey]);
                        }
                      }}
                    />
                  </td>
                )}
                {columns.map(col => (
                  <td key={col.accessor}>
                    {col.render
                      ? col.render(row)
                      : row[col.accessor]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {totalPages > 1 && (
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={onPageChange}
        />
      )}
    </div>
  );
};

AdminDataTable.propTypes = {
  columns:       PropTypes.arrayOf(PropTypes.shape({
                   header: PropTypes.string.isRequired,
                   accessor: PropTypes.string.isRequired,
                   render: PropTypes.func,
                 })).isRequired,
  data:          PropTypes.array.isRequired,
  loading:       PropTypes.bool.isRequired,
  totalItems:    PropTypes.number.isRequired,
  currentPage:   PropTypes.number.isRequired,
  itemsPerPage:  PropTypes.number.isRequired,
  onPageChange:  PropTypes.func.isRequired,
  rowSelection:  PropTypes.shape({
    selectedRowKeys: PropTypes.array.isRequired,
    onChange:        PropTypes.func.isRequired,
  })
};

AdminDataTable.defaultProps = {
  rowSelection: null
};

export default AdminDataTable;
