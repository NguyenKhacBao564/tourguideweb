import React, { useState } from 'react';
import DropDownButton from '../DropDown/DropDownButton';
import "./TourFilterEmployee.scss";
import SearchFilter from '../SearchFilter/SearchFilter';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import { RiDeleteBin2Fill } from "react-icons/ri";
import { GoPlus } from "react-icons/go";
import { useNavigate } from "react-router-dom";


function TourFilterEmployee() {

    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const onSearch = (value) => {
        setSearchTerm(value);
        // Gọi API hoặc thực hiện tìm kiếm ở đây
        // console.log("Tìm kiếm theo mã tour:", value);
    }


    return (
        <div>
            <div className="tour-filter__area1 ">
                <div className="tour-filter__dropdownbtn">
                    <span>Lọc</span>
                    <DropDownButton title="Bộ lọc" dropitem={[
                        { name: "Còn ít chổ trống nhât", link: "#" },
                        { name: "Còn nhiều chổ trống nhất", link: "#" },
                    ]}/>
                </div>
                <div className="tour-filter__search">
                    <SearchFilter onSearch={onSearch} />
                </div>
                <ButtonToolbar aria-label="Toolbar with button groups" className="tour-filter__button-toolbar">
                    <ButtonGroup className="me-2" aria-label="First group" >
                        <Button variant="danger" className='flex-center gap-2' >Khóa tour đã chọn <RiDeleteBin2Fill /></Button>
                    </ButtonGroup>
                    <ButtonGroup className="me-2" aria-label="Second group" >
                        <Button variant="success" className='flex-center gap-2' onClick={() => navigate("addtour")}>Thêm tour <GoPlus /></Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </div>

          
        </div>
    );
}

export default TourFilterEmployee;         