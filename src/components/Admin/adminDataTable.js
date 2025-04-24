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
}) => {
  if (loading) return <p>Loading…</p>;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div>
      <table className="table table-striped">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.accessor}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row[columns[0].accessor]}>
              {columns.map(col => (
                <td key={col.accessor}>
                  {col.render
                    ? col.render(row)
                    : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
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
};

export default AdminDataTable;
