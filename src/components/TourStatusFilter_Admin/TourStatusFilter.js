import React, { useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
// import "./TourStatusFilter.scss";

function TourStatusFilter({ onFilterChange }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    {key: "all", label: "Tất cả"},
    { key: "sapKhoiHanh", label: "Sắp khởi hành" },
    { key: "dangKhoiHanh", label: "Đang khởi hành" },
    { key: "daHoanThanh", label: "Đã hoàn thành" },
    { key: "chuaKhoiHanh", label: "Chưa khởi hành" },
  ];

  const handleFilterClick = (filterKey) => {
    setActiveFilter(filterKey);
    onFilterChange(filterKey); // Gọi callback để cập nhật statusFilter
    // Kiểm tra giá trị filterKey
  };

  return (
    <ButtonGroup className="tour-status-filter mb-3">
      {filters.map((filter) => (
        <Button
          key={filter.key}
          variant={activeFilter === filter.key ? "primary" : "outline-primary"}
          onClick={() => handleFilterClick(filter.key)}
        >
          {filter.label}
        </Button>
      ))}
    </ButtonGroup>
  );
}

export default TourStatusFilter;