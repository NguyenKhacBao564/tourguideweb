// src/pages/Admin/components/BranchTable.js
import React from 'react';

/**
 * Props:
 * - data: Array<{ branch_id: number; branch_name: string; totalTours: number }>
 */
const BranchTable = ({ data }) => (
  <div className="card mb-4">
    <div className="card-header">Thống kê chi nhánh</div>
    <div className="card-body p-0">
      <table className="table mb-0">
        <thead className="thead-light">
          <tr>
            <th>Chi nhánh</th>
            <th>Doanh thu</th>
            <th>Tăng trưởng</th>
            <th>Tỷ lệ huỷ</th>
            <th>Sl Tour</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ branch_id, branch_name, totalTours }) => (
            <tr key={branch_id}>
              <td>{branch_name}</td>
              <td>{totalTours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default BranchTable;