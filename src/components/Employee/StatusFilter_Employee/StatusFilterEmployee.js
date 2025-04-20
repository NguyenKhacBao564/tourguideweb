import React, { useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { getTourStatusFilters, FILTER_KEYS } from "../../../utils/tourFilterHelpers";

function StatusFilterEmployee({ onFilterChange }) {
  const [activeFilter, setActiveFilter] = useState(FILTER_KEYS.ALL);

  // Get filters from utility function
  const filters = getTourStatusFilters();

  const handleFilterClick = (filterKey) => {
    setActiveFilter(filterKey);
    onFilterChange(filterKey);
  };

  return (
    <ButtonGroup className="tour-status-filter mb-3 mt-3">
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

export default StatusFilterEmployee;