import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Button from 'react-bootstrap/Button';
import { GoArrowRight } from "react-icons/go";
function ShowAllButton(props) {
    return (
        <div>
            <button 
                className="button-primary-outline px-4 py-2" 
                style={{ display: "flex",alignItems: "center",justifyContent: "center" , gap: "10px", borderRadius: "0px"}}>
                Xem tất cả <GoArrowRight />
            </button>
        </div>
    );
}

export default ShowAllButton;