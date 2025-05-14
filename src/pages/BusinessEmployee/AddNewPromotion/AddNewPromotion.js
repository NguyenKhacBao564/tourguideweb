import React, {useState} from 'react';
import { Container, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import PromotionBasicInfor from './PromotionBasicInfor';
import "./AddNewPromotion.scss"
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

function AddNewPromotion(props) {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        promotionName: '',
        promotionCode: '',
        discount: '',
        startDate: '',
        endDate: '',
        maxUse: 0,


    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({...values, [name]: value});
    }

    const goBack = () => {
        navigate(-1);
    }

    return (
        <>
            <div className="go-back d-flex align-items-center pb-3" >
                <IoIosArrowBack size={38} onClick={goBack} style={{cursor: 'pointer'}} />
                <h2 style={{color: '#339688', fontWeight: 'bold', margin: "0"}}>Thêm khuyến mãi mới</h2>
            </div>
            <Container fluid className="add-new-promotion py-4">
                <Form>
                    <PromotionBasicInfor values={values} onChange={handleInputChange} />
                    <Button 
                        variant="success" 
                        className="mt-3 py-3 px-5" 
                        style={{display: "block"}} 
                        type="submit"
                    >Lưu</Button>
                </Form>
            </Container>
        </>
    );
}

export default AddNewPromotion;