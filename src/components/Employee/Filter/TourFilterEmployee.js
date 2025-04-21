import React, { useState } from 'react';
import DropDownButton from '../../Common/DropDown/DropDownButton';
import "./FilterLayoutStyle.scss";
import SearchFilter from '../../Common/SearchFilter/SearchFilter';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import { RiDeleteBin2Fill } from "react-icons/ri";
import { GoPlus } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { getOccupancyFilters, OCCUPANCY_FILTERS } from "../../../utils/tourFilterHelpers";

function TourFilterEmployee({ 
  onSearch, 
  onSort, 
  onDeleteSelected, 
  selectedItems = [],
  searchPlaceholder = "Tìm kiếm theo tên tour"
}) {
    const navigate = useNavigate();
    
    // Get occupancy filter options
    const occupancyFilters = getOccupancyFilters();

    const handleSearch = (value) => {
        
        if (onSearch) {
            onSearch(value);
        }
    };
    
    const handleSort = (sortKey) => {
        if (onSort) {
            onSort(sortKey);
        }
    };
    
    const handleDeleteSelected = () => {
        if (onDeleteSelected && selectedItems.length > 0) {
            onDeleteSelected(selectedItems);
        }
    };

    return (
        <div>
            <div className="filter__area">
                <div className="filter__dropdownbtn">
                    <span>Lọc</span>
                    <DropDownButton 
                        title="Bộ lọc" 
                        dropitem={occupancyFilters.map(filter => ({
                            name: filter.label,
                            onClick: () => handleSort(filter.key)
                        }))}
                    />
                </div>
                <div className="filter__search">
                    <SearchFilter 
                        onSearch={handleSearch} 
                        placeholder={searchPlaceholder} 
                    />
                </div>
                <ButtonToolbar aria-label="Toolbar with button groups" className="filter__button-toolbar">
                    <ButtonGroup className="me-2" aria-label="First group" >
                        <Button 
                            variant="danger" 
                            className='flex-center gap-2'
                            onClick={handleDeleteSelected}
                            disabled={selectedItems.length === 0}
                        >
                            Khóa tour đã chọn {selectedItems.length > 0 && `(${selectedItems.length})`} <RiDeleteBin2Fill />
                        </Button>
                    </ButtonGroup>
                    
                    <ButtonGroup className="me-2" aria-label="Second group" >
                        <Button 
                            variant="success" 
                            className='flex-center gap-2' 
                            onClick={() => navigate("addtour")}
                        >
                            Thêm tour <GoPlus />
                        </Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </div>
        </div>
    );
}

export default TourFilterEmployee;         