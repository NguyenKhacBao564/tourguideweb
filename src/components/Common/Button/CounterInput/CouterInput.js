import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { GoPlus } from "react-icons/go";
import { RiSubtractFill } from "react-icons/ri";
import "./CounterInput.scss";

function CouterInput({label, value, onChange}) {

    const [num, setNum] = useState(value);

    const handleSeatDecrease = () => {
        if (num > 1) setNum(num - 1);
      };
    
    const handleSeatIncrease = () => {
        setNum(num + 1);
    };
    
    return (
        <Form.Group className="counter-input">
            <Form.Label className="counter-input-label">{label}</Form.Label>
            <InputGroup>
              <Button variant="light" className="button-subtract" onClick={handleSeatDecrease}>
                <RiSubtractFill size={20}/>
              </Button>
              <Form.Control
                type="text" 
                className="text-center shadow-none border-0"
                value={num}
                onChange={onChange}
              />
              <Button variant="light" className="button-plus" onClick={handleSeatIncrease}>
                    <GoPlus size={20}/>
              </Button>
            </InputGroup>
          </Form.Group>
    );
}

export default CouterInput;