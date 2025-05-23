// src/pages/Admin/Branches/BranchInfo.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Badge } from "react-bootstrap";
import { getBranchDetail } from "../../../api/adminAPI"; // bạn cần tạo API này
import Chart from "react-apexcharts"; // hoặc dùng chartjs, recharts...

const BranchInfo = () => {
  const { id } = useParams();
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await getBranchDetail(id);
        setBranch(data);
      } catch (err) {
        alert("Lỗi khi lấy thông tin chi tiết chi nhánh");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (!branch) return <div>Không tìm thấy chi nhánh</div>;

  return (
    <div className="branch-detail-page" style={{padding: 24}}>
      {/* Header */}
      <div className="branch-header" style={{
        display: "flex", alignItems: "center", gap: 24, background: "#fff", borderRadius: 12, padding: 24, marginBottom: 24
      }}>
        <div>
          <div style={{fontSize: 32, fontWeight: 700}}>{branch.branch_name}</div>
          <div style={{fontWeight: 600, color: "#1a237e"}}>#{branch.branch_code || branch.branch_id}</div>
        </div>
        <div>
          <div><b>Số điện thoại:</b> {branch.phone}</div>
          <div><b>Địa chỉ:</b> {branch.address}</div>
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
            <div style={{fontWeight: 600, marginBottom: 8}}>Thống kê theo tháng</div>
            <Chart
              type="bar"
              height={250}
              series={[{ name: "Doanh thu", data: branch.monthlyRevenue }]}
              options={{
                chart: { toolbar: { show: false } },
                xaxis: { categories: branch.months },
                dataLabels: { enabled: false }
              }}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div style={{background: "#fff", borderRadius: 12, padding: 24, marginBottom: 24}}>
            <div style={{fontWeight: 600, marginBottom: 8}}>Lịch theo năm</div>
            {/* Render năm, có thể dùng map */}
            <div style={{display: "flex", flexDirection: "column", gap: 8}}>
              {branch.years.map(y => (
                <Button key={y} variant={y === branch.selectedYear ? "primary" : "outline-primary"}>{y}</Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pie & Doughnut */}
      <div className="row">
        <div className="col-md-4">
          <div style={{background: "#fff", borderRadius: 12, padding: 24, marginBottom: 24}}>
            <div style={{fontWeight: 600, marginBottom: 8}}>Tỷ lệ khách đặt/hủy</div>
            <Chart
              type="donut"
              height={200}
              series={[branch.booked, branch.canceled]}
              options={{
                labels: ["Đã đặt", "Đã bị hủy"],
                colors: ["#00bcd4", "#ff5252"]
              }}
            />
            <div style={{textAlign: "center", fontWeight: 700, fontSize: 24, marginTop: 8}}>
              {branch.cancelRate}%
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div style={{background: "#fff", borderRadius: 12, padding: 24, marginBottom: 24}}>
            <div style={{fontWeight: 600, marginBottom: 8}}>Các tour trong kế hoạch</div>
            <Chart
              type="donut"
              height={200}
              series={branch.tourStats.map(t => t.value)}
              options={{
                labels: branch.tourStats.map(t => t.label),
                colors: ["#1976d2", "#00e676", "#ffb300", "#ff5252", "#388e3c"]
              }}
            />
            <div style={{marginTop: 16}}>
              {branch.tourStats.map((t, idx) => (
                <div key={idx} style={{display: "flex", alignItems: "center", gap: 8}}>
                  <div style={{width: 12, height: 12, background: t.color, borderRadius: "50%"}}></div>
                  <div>{t.label}: {t.value}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop: 8}}>
              <a href="#">Xem tất cả tour của chi nhánh</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchInfo;