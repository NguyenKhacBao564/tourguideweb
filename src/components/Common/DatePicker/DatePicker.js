import React, { useRef } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { MdDateRange } from "react-icons/md";
import './DatePicker.scss';

function DatePicker({ label, value, onChange, name, required = false }) {

const inputRef = useRef(null);

  const handleIconClick = () => {
    if (inputRef.current) {
      inputRef.current.showPicker?.(); // Native datepicker (Chrome, Edge)
      inputRef.current.click();        // fallback nếu showPicker không hỗ trợ
    }
  };

  return (
    <Form.Group className="date-picker-input">
      {label && <Form.Label className="form-label">{label}</Form.Label>}
      <InputGroup>
        <InputGroup.Text 
        className="bg-transparent border-0 shadow-none"
        onClick={handleIconClick}
        style={{ cursor: 'pointer' }}
        >
          <MdDateRange size={28} className="icon-custom" />
        </InputGroup.Text>
        <Form.Control
            ref={inputRef}
            type="date"
            name={name}
            value={value}
            onChange={onChange}
            className="border-0 rounded-0 shadow-none no-native-icon"
            required={required}
        />
      </InputGroup>
    </Form.Group>
  );
}

export default DatePicker;
