import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

function AddShedule(props) {
    const {setActiveField, addSchedule, scheduleLength} = props;

    const [schedule, setSchedule] = useState({
        day_number: scheduleLength + 1,
        tour_route: '',
        description: ''
    });
    
    const handleChange = (e) => {
        setSchedule({...schedule, [e.target.name]: e.target.value});
    }
    
    const handleSubmit = () => {
        // Basic validation
        if (!schedule.tour_route.trim() || !schedule.description.trim()) {
            alert("Vui lòng nhập đầy đủ thông tin lịch trình");
            return;
        }
        
        // Call addSchedule with the schedule data
        addSchedule(schedule);
        
        // Close the modal
        setActiveField(false);
    }
    
    return (
        <Container className="add-schedule-area" >
        <Form.Group className="flex-center flex-column">
          <h1 >Lịch trình ngày {schedule.day_number}</h1>
          <Form.Group className="w-100">
            <Form.Label htmlFor='inputDestination'>Tên lịch trình<span className="text-danger">*</span></Form.Label>
            <Form.Control 
                name="tour_route" 
                type="text" 
                onChange={handleChange}  
                id="inputDestination" 
                placeholder="Nhập tên điểm tham quan"
                value={schedule.tour_route}
            />
          </Form.Group>
          <Form.Group className="w-100 mt-3">
            <Form.Label htmlFor='inputDescription'>Mô tả lịch trình<span className="text-danger">*</span></Form.Label>
            <Form.Control 
                name="description" 
                id="inputDescription" 
                as="textarea" 
                rows={6} 
                onChange={handleChange} 
                placeholder="Nhập mô tả lịch trình"
                value={schedule.description}
            />
          </Form.Group>
          <Form.Group className="w-100 mt-3 d-flex justify-content-end gap-3">
            <Button variant="secondary" className="px-4 py-2" onClick={() => setActiveField(false)}>Hủy</Button>
            <Button variant="primary" className="px-5 py-2" onClick={handleSubmit}>Thêm</Button>
          </Form.Group>
        </Form.Group>
      </Container>
    );
}

export default AddShedule;