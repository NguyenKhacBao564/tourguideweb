import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faHashtag, 
    faSignature, 
    faCalendarDays, 
    faLocationDot, 
    faPlaneDeparture, 
    faUsers, 
    faBus, 
    faAlignLeft 
} from "@fortawesome/free-solid-svg-icons";
import './AddTourArea.scss';

function AddTourArea(props) {
    const [tourData, setTourData] = useState({
        tour_id: '',
        name: '',
        duration: '',
        destination: '',
        departure: '',
        startDate: '',
        endDate: '',
        maxGuests: '',
        transport: '',
        description: '',
        branch_id: 1
    });

    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTourData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/tours/createtour", tourData);
            setAlert({
                show: true,
                type: 'success',
                message: 'Thêm tour thành công!'
            });
            // Reset form
            // setTourData({
            //     tour_id: '',
            //     name: '',
            //     duration: '',
            //     destination: '',
            //     departure: '',
            //     startDate: '',
            //     endDate: '',
            //     maxGuests: '',
            //     transport: '',
            //     description: '',
            //     branch_id: 1
            // });
        } catch (error) {
            setAlert({
                show: true,
                type: 'error',
                message: 'Có lỗi xảy ra khi thêm tour. Vui lòng thử lại!'
            });
            console.error("Lỗi khi thêm tour:", error);
        }

        if (props.onSubmit) {
            props.onSubmit(tourData);
        }
    };

    return (
        <div className="add-tour-container">
            <div className="form-header">
                <h2>Thêm Tour Mới</h2>
                <p>Điền thông tin chi tiết về tour du lịch</p>
            </div>

            {alert.show && (
                <div className={`alert alert-${alert.type}`}>
                    {alert.message}
                </div>
            )}

            <Form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <Form.Label>Mã Tour</Form.Label>
                        <div className="input-wrapper">
                            <FontAwesomeIcon icon={faHashtag} className="input-icon" />
                            <Form.Control
                                type="text"
                                name="tour_id"
                                value={tourData.tour_id}
                                onChange={handleChange}
                                placeholder="Nhập mã tour"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <Form.Label>Tên Tour</Form.Label>
                        <div className="input-wrapper">
                            <FontAwesomeIcon icon={faSignature} className="input-icon" />
                            <Form.Control
                                type="text"
                                name="name"
                                value={tourData.name}
                                onChange={handleChange}
                                placeholder="Nhập tên tour"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <Form.Label>Thời Lượng (Ngày)</Form.Label>
                        <div className="input-wrapper">
                            <FontAwesomeIcon icon={faCalendarDays} className="input-icon" />
                            <Form.Control
                                type="number"
                                name="duration"
                                value={tourData.duration}
                                onChange={handleChange}
                                placeholder="Số ngày"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <Form.Label>Điểm Đến</Form.Label>
                        <div className="input-wrapper">
                            <FontAwesomeIcon icon={faLocationDot} className="input-icon" />
                            <Form.Control
                                type="text"
                                name="destination"
                                value={tourData.destination}
                                onChange={handleChange}
                                placeholder="Nhập điểm đến"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <Form.Label>Điểm Khởi Hành</Form.Label>
                        <div className="input-wrapper">
                            <FontAwesomeIcon icon={faPlaneDeparture} className="input-icon" />
                            <Form.Control
                                type="text"
                                name="departure"
                                value={tourData.departure}
                                onChange={handleChange}
                                placeholder="Nhập điểm khởi hành"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <Form.Label>Ngày Khởi Hành</Form.Label>
                        <div className="input-wrapper">
                            <FontAwesomeIcon icon={faCalendarDays} className="input-icon" />
                            <Form.Control
                                type="date"
                                name="startDate"
                                value={tourData.startDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <Form.Label>Ngày Kết Thúc</Form.Label>
                        <div className="input-wrapper">
                            <FontAwesomeIcon icon={faCalendarDays} className="input-icon" />
                            <Form.Control
                                type="date"
                                name="endDate"
                                value={tourData.endDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <Form.Label>Số Khách Tối Đa</Form.Label>
                        <div className="input-wrapper">
                            <FontAwesomeIcon icon={faUsers} className="input-icon" />
                            <Form.Control
                                type="number"
                                name="maxGuests"
                                value={tourData.maxGuests}
                                onChange={handleChange}
                                placeholder="Số khách tối đa"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <Form.Label>Phương Tiện</Form.Label>
                        <div className="input-wrapper">
                            <FontAwesomeIcon icon={faBus} className="input-icon" />
                            <Form.Control
                                type="text"
                                name="transport"
                                value={tourData.transport}
                                onChange={handleChange}
                                placeholder="Nhập phương tiện"
                            />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <Form.Label>Mô Tả Tour</Form.Label>
                        <div className="input-wrapper">
                            <FontAwesomeIcon icon={faAlignLeft} className="input-icon" />
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={tourData.description}
                                onChange={handleChange}
                                placeholder="Mô tả chi tiết về tour"
                            />
                        </div>
                    </div>
                </div>

                <Button type="submit" className="submit-btn">
                    <FontAwesomeIcon icon={faSignature} />
                    Thêm Tour
                </Button>
            </Form>
        </div>
    );
}

export default AddTourArea;
