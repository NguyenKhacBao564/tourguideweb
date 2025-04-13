import React from 'react';
import { DollarSign, Users, Map, ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  // Tour data for the donut chart
  const tourData = [
    { name: 'Đã khởi hành', value: 750, color: '#4fe3c1' },
    { name: 'Chưa khởi hành', value: 149, color: '#ff7a7a' },
  ];

  // Recent transactions data
  const recentTransactions = [
    {
      id: 1,
      customer: "Nguyễn Khắc Bảo",
      phone: "0778172590",
      tourCode: "NBAKWHE19",
      time: "1 tiếng trước",
      amount: "19.000.000",
      status: "Đã thanh toán"
    },
    {
      id: 2,
      customer: "Trần Quốc Bảo",
      phone: "0778172590",
      tourCode: "NBAKWHE18",
      time: "2 tiếng trước",
      amount: "11.000.000",
      status: "Đã thanh toán"
    },
    {
      id: 3,
      customer: "Lê Việt Tuấn Anh",
      phone: "0778172590",
      tourCode: "NBAKWHE89",
      time: "3 tiếng trước",
      amount: "15.000.000",
      status: "Đã thanh toán"
    },
    {
      id: 4,
      customer: "Phạm Phúc Duy",
      phone: "0778172590",
      tourCode: "NBAKWHE99",
      time: "5 tiếng trước",
      amount: "29.000.000",
      status: "Đã thanh toán"
    }
  ];

  // Branch statistics data
  const branchStats = [
    {
      branch: "Hà nội",
      revenue: "12.000.000",
      growth: 9,
      decline: 9,
      tours: 100
    },
    {
      branch: "TP HCM",
      revenue: "35.000.000",
      growth: 15,
      decline: 15,
      tours: 200
    },
    {
      branch: "Hải Phòng",
      revenue: "15.900.000",
      growth: 12,
      decline: 15,
      tours: 150
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="admin-title">Thống kê</h2>
      
      {/* Stats Cards */}
      <div className="admin-grid">
        <div className="stats-card revenue-card text-white">
          <div className="stats-icon bg-teal-400 bg-opacity-30 text-white">
            <DollarSign size={24} />
          </div>
          <div>
            <div className="text-sm text-teal-100">Doanh thu</div>
            <div className="text-2xl font-bold mt-1">12.000.000 VND</div>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="stats-icon bg-blue-100 text-blue-500">
            <Users size={24} />
          </div>
          <div>
            <div className="text-sm text-gray-500">Tổng số khách hàng</div>
            <div className="text-2xl font-bold mt-1">1000</div>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="stats-icon bg-yellow-100 text-yellow-500">
            <Map size={24} />
          </div>
          <div>
            <div className="text-sm text-gray-500">Tổng số Tour</div>
            <div className="text-2xl font-bold mt-1">500</div>
          </div>
        </div>
      </div>

      {/* Branch Statistics and Chart */}
      <div className="stats-chart-container mt-8 stats-to-table-gap">
        {/* Branch Statistics */}
        <div className="table-container" style={{ flex: 1 }}>
          <div className="table-header">
            <h3 className="table-title">Thống kê theo chi nhánh</h3>
            <button className="text-blue-600 text-sm flex items-center gap-1 view-all-btn btn-view-all">
              Xem tất cả 
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Chi nhánh</th>
                  <th>Doanh thu</th>
                  <th>Tăng trưởng</th>
                  <th>Tỷ lệ huỷ</th>
                  <th>Sl tour</th>
                </tr>
              </thead>
              <tbody>
                {branchStats.map((branch, index) => (
                  <tr key={index}>
                    <td className="font-medium">{branch.branch}</td>
                    <td>{branch.revenue}</td>
                    <td>
                      <span className="text-green-500 flex items-center gap-1">
                        {branch.growth}% <ArrowUpRight size={14} />
                      </span>
                    </td>
                    <td>
                      <span className="text-red-500 flex items-center gap-1">
                        {branch.decline}% <ArrowDownRight size={14} />
                      </span>
                    </td>
                    <td>{branch.tours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tour Statistics Chart */}
        <div className="table-container-chart  p-4" style={{ flex: 1/10 }}>
          <h3 className="legend-text-chart font-semibold mb-1">Tỷ lệ tour đã hoàn thành/chưa khởi hành</h3>
          <div className="donut-chart flex justify-center">
            <PieChart width={200} height={200}>
              <Pie
                data={tourData}
                cx={100}
                cy={100}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {tourData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
            <div className="donut-text">
              <div className="donut-number">899</div>
              <div className="donut-label">Tour</div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <div className="chart-legend">
              <div className="legend-color" style={{ backgroundColor: '#4fe3c1' }}></div>
              <div className="legend-text">Đã khởi hành</div>
            </div>
            <div className="chart-legend">
              <div className="legend-color" style={{ backgroundColor: '#ff7a7a' }}></div>
              <div className="legend-text">Chưa khởi hành</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="table-container-recent mt-8 stats-to-table-gap">
        <div className="table-header">
          <h3 className="table-title">Giao dịch gần đây</h3>
          <button className="text-blue-600 text-sm flex items-center gap-1 view-all-btn btn-view-all">
            Xem tất cả 
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Số điện thoại</th>
                <th>Mã tour đã đặt</th>
                <th>Thời gian</th>
                <th>Số tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                      <img
                        src="/lovable-uploads/24449661-392d-48a0-833e-05a036efec05.png"
                        alt={transaction.customer}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium">{transaction.customer}</span>
                  </td>
                  <td>{transaction.phone}</td>
                  <td><span className="text-orange-500">{transaction.tourCode}</span></td>
                  <td>{transaction.time}</td>
                  <td className="font-medium">{transaction.amount}</td>
                  <td>
                    <span className="btn btn-success py-1 px-2">{transaction.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 