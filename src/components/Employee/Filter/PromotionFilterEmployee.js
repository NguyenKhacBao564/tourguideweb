import React from 'react';

import "./FilterLayoutStyle.scss";
import SearchFilter from '../../Common/SearchFilter/SearchFilter';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import { RiDeleteBin2Fill } from "react-icons/ri";
import DropDownButton from '../../Common/DropDown/DropDownButton';
import { GoPlus } from "react-icons/go";

import { useNavigate } from "react-router-dom";



function PromotionFilterEmployee({
    searchPlaceholder = "Tìm kiếm theo mã khuyến mãi",
    selectedItems = [],
    onBlockSelected
}) {
    const navigate = useNavigate();

    const occupancyFilters = [
        { key: 'all', label: 'Tất cả' },
        { key: 'occupied', label: 'Đang hoạt động' },
        { key: 'available', label: 'Hết hạn' },
    ];

    const handleBlockSelected = () => {
        if(onBlockSelected && selectedItems.length > 0) {
            onBlockSelected(selectedItems);
        }
    }

    const handleSort = (key) => {
        console.log("Sort by: ", key);
    }
    const handleSearch = () => {
        console.log("Delete selected items");
    }


    // const selectedItems = () =>
    // {
    //     return " Đã chọn tour";
    // }

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
                            onClick={handleBlockSelected}
                            disabled={selectedItems.length === 0}
                        >
                            Khóa khuyến mãi đã chọn {selectedItems.length > 0 && `(${selectedItems.length})`} <RiDeleteBin2Fill />
                        </Button>
                    </ButtonGroup>
                    
                    <ButtonGroup className="me-2" aria-label="Second group" >
                        <Button 
                            variant="success" 
                            className='flex-center gap-2' 
                            onClick={() => navigate("addpromotion", {state: {tourDetail: null}})}
                        >
                            Thêm khuyến mãi <GoPlus />
                        </Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </div>
        </div>
    );
}

export default PromotionFilterEmployee;