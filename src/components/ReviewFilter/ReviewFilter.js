import React from 'react';
import "./ReviewFilter.scss"
import Container from 'react-bootstrap/Container';
import DropDownButton from '../Common/DropDown/DropDownButton';
import SearchFilter from '../Common/SearchFilter/SearchFilter';
import { CiFilter } from "react-icons/ci";

function ReviewFilter(props) {
    const sortItem = [
        {name: "Mới nhất"},
        {name: "Cũ nhất"},
    ]

    const filterItem = [
        {name: "Tất cả"},
        {name: "5 sao"},
        {name: "4 sao"},
        {name: "3 sao"},
        {name: "2 sao"},
        {name: "1 sao"},
    ]

    return (
        <Container className='review-filter d-flex gap-3'>
            <div className='filter-icon d-flex align-items-center gap-1'> 
                <CiFilter />
                <span>Lọc</span>
            </div>
            <div className='sort-btn d-flex align-items-center gap-1'>
                <DropDownButton title="Sắp xếp" dropitem={sortItem} />
            </div>
            <div className='filter-btn d-flex align-items-center gap-1'>
                <DropDownButton title="Lọc" dropitem={filterItem} />
            </div>
            <div className='search-area d-flex align-items-center gap-1'>
                <SearchFilter placeholder="Tìm kiếm ở đây" />
            </div>
        </Container>
    );
}

export default ReviewFilter;