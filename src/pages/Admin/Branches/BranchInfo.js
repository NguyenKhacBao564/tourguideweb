// src/pages/Admin/Branches/BranchInfo.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Badge } from "react-bootstrap";
import { getBranchDetail } from "../../../api/adminAPI";
import Chart from "react-apexcharts";

const BranchInfo = () => {
  const { id } = useParams();
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBranchDetail(id);
        console.log("Branch data received:", data); // Để debug
        setBranch(data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin chi tiết chi nhánh:", err);
        setError(err.message || "Lỗi khi lấy thông tin chi tiết chi nhánh");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="text-center p-4">Đang tải...</div>;
  if (error) return <div className="text-center p-4 text-danger">Lỗi: {error}</div>;
  if (!branch) return <div className="text-center p-4">Không tìm thấy chi nhánh</div>;

  // Chuẩn bị dữ liệu an toàn cho charts
  const safeMonthlyRevenue = Array.isArray(branch.monthlyRevenue) ? 
    branch.monthlyRevenue.map(val => Number(val) || 0) : 
    Array(12).fill(0);
    
  const safeMonths = Array.isArray(branch.months) ? branch.months : 
    ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  // Chuẩn bị dữ liệu cho tour stats pie chart
  const tourStats = branch.tourStats || {};
  const tourStatsEntries = Object.entries(tourStats).filter(([_, v]) => 
    typeof v === 'number' && v > 0 && !isNaN(v)
  );
  const hasTourStats = tourStatsEntries.length > 0;
  const tourStatsSeries = hasTourStats ? tourStatsEntries.map(([_, value]) => Number(value)) : [1];
  const tourStatsLabels = hasTourStats ? tourStatsEntries.map(([key]) => key) : ['Không có dữ liệu'];
  const tourStatsColors = ["#1976d2", "#00e676", "#ffb300", "#ff5252", "#388e3c"];

  // Chuẩn bị dữ liệu cho booking stats
  const bookingStats = branch.bookingStats || {};
  const confirmedBookings = Number(bookingStats.confirmed) || 0;
  const canceledBookings = Number(bookingStats.canceled) || 0;
  const totalBookings = confirmedBookings + canceledBookings;
  const cancellationRate = totalBookings > 0 ? Math.round((canceledBookings * 100) / totalBookings) : 0;

  // Chuẩn bị dữ liệu an toàn cho years
  const safeYears = Array.isArray(branch.years) ? branch.years : [new Date().getFullYear()];

  // Cấu hình chung cho ApexCharts
  const commonChartOptions = {
    chart: {
      toolbar: { show: false },
      background: 'transparent',
      animations: {
        enabled: false // Tắt animation để tránh lỗi
      }
    },
    dataLabels: { enabled: false },
    legend: {
      show: true,
      position: 'bottom'
    }
  };

  return (
    <div className="branch-detail-page" style={{padding: 24}}>
      {/* Header */}
      <div className="branch-header" style={{
        display: "flex", alignItems: "center", gap: 24, background: "#fff", borderRadius: 12, padding: 24, marginBottom: 24
      }}>
        <div>
          <div style={{fontSize: 32, fontWeight: 700}}>{branch.branch_name || 'N/A'}</div>
          <div style={{fontWeight: 600, color: "#1a237e"}}>#{branch.branch_code || branch.branch_id}</div>
        </div>
        <div>
          <div><b>Số điện thoại:</b> {branch.phone || 'N/A'}</div>
          <div><b>Địa chỉ:</b> {branch.address || 'N/A'}</div>
        </div>
        <div>
          <Badge bg={branch.status === "active" ? "success" : "secondary"}>
            {branch.status === "active" ? "HOẠT ĐỘNG" : "KHÔNG HOẠT ĐỘNG"}
          </Badge>
        </div>
        <Button variant="primary">Xác nhận thay đổi</Button>
      </div>

      {/* Charts & Stats */}
      <div className="row" style={{marginBottom: 24}}>
        <div className="col-md-8">
          <div style={{background: "#fff", borderRadius: 12, padding: 24, marginBottom: 24}}>
            <div style={{fontWeight: 600, marginBottom: 8}}>Thống kê doanh thu theo tháng</div>
            <Chart
              type="bar"
              height={250}
              series={[{ 
                name: "Doanh thu (VND)", 
                data: safeMonthlyRevenue 
              }]}
              options={{
                ...commonChartOptions,
                xaxis: { 
                  categories: safeMonths,
                  labels: {
                    style: {
                      fontSize: '12px'
                    }
                  }
                },
                yaxis: {
                  labels: {
                    formatter: function (value) {
                      return new Intl.NumberFormat('vi-VN').format(value) + ' VND';
                    }
                  }
                },
                colors: ['#1976d2'],
                plotOptions: {
                  bar: {
                    borderRadius: 4
                  }
                }
              }}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div style={{background: "#fff", borderRadius: 12, padding: 24, marginBottom: 24}}>
            <div style={{fontWeight: 600, marginBottom: 8}}>Lọc theo năm</div>
            <div style={{display: "flex", flexDirection: "column", gap: 8}}>
              {safeYears.map(y => (
                <Button 
                  key={y} 
                  variant={y === branch.selectedYear ? "primary" : "outline-primary"}
                  size="sm"
                >
                  {y}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pie & Doughnut */}
      <div className="row">
        <div className="col-md-4">
          <div style={{background: "#fff", borderRadius: 12, padding: 24, marginBottom: 24}}>
            <div style={{fontWeight: 600, marginBottom: 8}}>Tỷ lệ đặt tour/hủy tour</div>
            {totalBookings > 0 ? (
              <>
                <Chart
                  type="donut"
                  height={200}
                  series={[confirmedBookings, canceledBookings]}
                  options={{
                    ...commonChartOptions,
                    labels: ["Đã đặt", "Đã hủy"],
                    colors: ["#00bcd4", "#ff5252"],
                    dataLabels: {
                      enabled: true,
                      formatter: function (val, opts) {
                        return Math.round(val) + '%';
                      }
                    }
                  }}
                />
                <div style={{textAlign: "center", fontWeight: 700, fontSize: 24, marginTop: 8}}>
                  Tỷ lệ hủy: {cancellationRate}%
                </div>
              </>
            ) : (
              <div style={{textAlign: "center", padding: 40, color: "#999"}}>
                Không có dữ liệu booking
              </div>
            )}
          </div>
        </div>
        <div className="col-md-8">
          <div style={{background: "#fff", borderRadius: 12, padding: 24, marginBottom: 24}}>
            <div style={{fontWeight: 600, marginBottom: 8}}>Phân loại tour theo trạng thái</div>
            {hasTourStats ? (
              <>
                <Chart
                  type="donut"
                  height={200}
                  series={tourStatsSeries}
                  options={{
                    ...commonChartOptions,
                    labels: tourStatsLabels,
                    colors: tourStatsColors.slice(0, tourStatsLabels.length),
                    dataLabels: {
                      enabled: true,
                      formatter: function (val, opts) {
                        const seriesIndex = opts.seriesIndex;
                        return tourStatsSeries[seriesIndex];
                      }
                    }
                  }}
                />
                <div style={{marginTop: 16}}>
                  {tourStatsEntries.map(([key, value], idx) => (
                    <div key={key} style={{display: "flex", alignItems: "center", gap: 8, marginBottom: 4}}>
                      <div style={{
                        width: 12,
                        height: 12,
                        background: tourStatsColors[idx % tourStatsColors.length],
                        borderRadius: "50%"
                      }}></div>
                      <div style={{textTransform: 'capitalize'}}>{key}: <strong>{value}</strong> tour</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{textAlign: "center", padding: 40, color: "#999"}}>
                Không có dữ liệu tour
              </div>
            )}
            <div style={{marginTop: 16}}>
              <a href="#" style={{color: "#1976d2", textDecoration: "none"}}>
                Xem tất cả tour của chi nhánh →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <div className="row">
        <div className="col-md-12">
          <div style={{background: "#fff", borderRadius: 12, padding: 24}}>
            <div style={{fontWeight: 600, marginBottom: 16}}>Thống kê tổng quan</div>
            <div className="row">
              <div className="col-md-3">
                <div style={{textAlign: "center", padding: 16, border: "1px solid #e0e0e0", borderRadius: 8}}>
                  <div style={{fontSize: 24, fontWeight: 700, color: "#1976d2"}}>
                    {bookingStats.totalRevenue ? new Intl.NumberFormat('vi-VN').format(bookingStats.totalRevenue) : '0'}
                  </div>
                  <div style={{color: "#666"}}>Tổng doanh thu (VND)</div>
                </div>
              </div>
              <div className="col-md-3">
                <div style={{textAlign: "center", padding: 16, border: "1px solid #e0e0e0", borderRadius: 8}}>
                  <div style={{fontSize: 24, fontWeight: 700, color: "#00e676"}}>
                    {tourStats.total || 0}
                  </div>
                  <div style={{color: "#666"}}>Tổng số tour</div>
                </div>
              </div>
              <div className="col-md-3">
                <div style={{textAlign: "center", padding: 16, border: "1px solid #e0e0e0", borderRadius: 8}}>
                  <div style={{fontSize: 24, fontWeight: 700, color: "#ffb300"}}>
                    {bookingStats.total || 0}
                  </div>
                  <div style={{color: "#666"}}>Tổng booking</div>
                </div>
              </div>
              <div className="col-md-3">
                <div style={{textAlign: "center", padding: 16, border: "1px solid #e0e0e0", borderRadius: 8}}>
                  <div style={{fontSize: 24, fontWeight: 700, color: "#ff5252"}}>
                    {branch.employeeStats?.total || 0}
                  </div>
                  <div style={{color: "#666"}}>Tổng nhân viên</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchInfo;