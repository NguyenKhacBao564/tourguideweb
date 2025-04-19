import React, { useState } from 'react';

import "./FilterLayoutStyle.scss";
import SearchFilter from '../../Common/SearchFilter/SearchFilter';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import { RiDeleteBin2Fill } from "react-icons/ri";
import { GoPlus } from "react-icons/go";
import { useNavigate } from "react-router-dom";


function UserFilterEmployee() {

    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const onSearch = (value) => {
        setSearchTerm(value);
        // Gọi API hoặc thực hiện tìm kiếm ở đây
        // console.log("Tìm kiếm theo mã tour:", value);
    }


    return (
        <div>
            <div className="filter__area ">
                <div className="filter__search">
                    <SearchFilter onSearch={onSearch} />
                </div>
                <ButtonToolbar aria-label="Toolbar with button groups" className="filter__button-toolbar">
                    <ButtonGroup className="me-2" aria-label="First group" >
                        <Button variant="danger" className='flex-center gap-2' >Khóa tour đã chọn <RiDeleteBin2Fill /></Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </div>

          
        </div>
    );
}

export default UserFilterEmployee;         