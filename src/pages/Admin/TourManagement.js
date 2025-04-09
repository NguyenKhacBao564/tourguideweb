import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, MoreVertical, MapPin, Calendar, Users, DollarSign } from 'lucide-react';

const TourManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample tour data
  const tourData = [
    {
      id: 1,
      name: "Tour Hà Nội - Sapa 3 ngày 2 đêm",
      code: "HNSP3N2D",
      destination: "Sapa, Lào Cai",
      departureDate: "15/06/2023",
      duration: "3 ngày 2 đêm",
      price: "2.500.000",
      capacity: 30,
      booked: 25,
      status: "active"
    },
    {
      id: 2,
      name: "Tour TP HCM - Phú Quốc 4 ngày 3 đêm",
      code: "HCMPQ4N3D",
      destination: "Phú Quốc, Kiên Giang",
      departureDate: "20/06/2023",
      duration: "4 ngày 3 đêm",
      price: "3.200.000",
      capacity: 25,
      booked: 20,
      status: "active"
    },
    {
      id: 3,
      name: "Tour Hà Nội - Hạ Long 2 ngày 1 đêm",
      code: "HNHL2N1D",
      destination: "Hạ Long, Quảng Ninh",
      departureDate: "10/06/2023",
      duration: "2 ngày 1 đêm",
      price: "1.800.000",
      capacity: 20,
      booked: 15,
      status: "inactive"
    },
    {
      id: 4,
      name: "Tour TP HCM - Đà Lạt 3 ngày 2 đêm",
      code: "HCMDL3N2D",
      destination: "Đà Lạt, Lâm Đồng",
      departureDate: "25/06/2023",
      duration: "3 ngày 2 đêm",
      price: "2.800.000",
      capacity: 30,
      booked: 28,
      status: "active"
    },
    {
      id: 5,
      name: "Tour Hải Phòng - Cát Bà 2 ngày 1 đêm",
      code: "HPCB2N1D",
      destination: "Cát Bà, Hải Phòng",
      departureDate: "05/06/2023",
      duration: "2 ngày 1 đêm",
      price: "1.500.000",
      capacity: 25,
      booked: 22,
      status: "active"
    }
  ];

  // Filter tours based on search term
  const filteredTours = tourData.filter(tour => 
    tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="admin-title">Quản lý Tour</h2>
        <button className="btn btn-primary">
          <Plus size={16} />
          <span>Thêm Tour</span>
        </button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Tìm kiếm tour..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="input-group-icon">
              <Search size={16} />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Tên Tour</th>
                <th>Mã Tour</th>
                <th>Điểm đến</th>
                <th>Ngày khởi hành</th>
                <th>Thời gian</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredTours.map((tour) => (
                <tr key={tour.id}>
                  <td className="font-medium">{tour.name}</td>
                  <td><span className="text-orange-500">{tour.code}</span></td>
                  <td>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{tour.destination}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{tour.departureDate}</span>
                    </div>
                  </td>
                  <td>{tour.duration}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} />
                      <span>{tour.price}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{tour.booked}/{tour.capacity}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${tour.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                      {tour.status === 'active' ? 'Đang bán' : 'Đã kết thúc'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="btn btn-light p-1">
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-light p-1">
                        <Trash2 size={16} />
                      </button>
                      <button className="btn btn-light p-1">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Hiển thị {filteredTours.length} tour
          </div>
          <div className="pagination">
            <div className="page-item active">1</div>
            <div className="page-item">2</div>
            <div className="page-item">3</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourManagement;
