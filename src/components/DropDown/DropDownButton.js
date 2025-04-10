import Dropdown from 'react-bootstrap/Dropdown';
import React, { useState } from 'react';
import "./DropDownButton.scss"

function DropDownButton(props) {

  const {title , dropitem} = props;

  const [selectedItem, setSelectedItem] = useState(title);

  const handleSelect = (eventKey) => {
      setSelectedItem(eventKey);
      console.log(eventKey);
  }

  return (
    <Dropdown className='dropdown-btn'>
      <Dropdown.Toggle  id="dropdown-basic" >
        {selectedItem}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {dropitem.map((item, index) => (
          <Dropdown.Item onClick={() => handleSelect(item.name)} key={index} href={item.link}>
            {item.name} 
          </Dropdown.Item>
        ))}
        {/* <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>} */}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropDownButton;