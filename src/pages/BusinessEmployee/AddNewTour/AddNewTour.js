import React, { useState, useContext } from 'react';
import {Container, Row, Col, Button, InputGroup} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputFiledIcon from '../../../components/Common/InputFieldIcon/InputFieldIcon';
import InputFieldIcon2 from '../../../components/Common/InputFieldIcon/InputFieldIcon2';
import PriceSection from '../../../components/Employee/PriceSelector/PriceSection';
import AddShedule from './components/AddShedule';
import Schedule from './components/Schedule';
import { FaClock } from "react-icons/fa6";
import { CiCirclePlus } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import DatePicker from '../../../components/Common/DatePicker/DatePicker';
import CouterInput from '../../../components/Common/Button/CounterInput/CouterInput';
import DropDownIconBtn from '../../../components/Common/DropDownIcon/DropDownIconBtn';
import { FaCar } from "react-icons/fa";
import { v4 as uuidv4 } from 'uuid';
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import "./AddNewTour.scss"
import { useNavigate } from 'react-router-dom';
import { TourContext } from '../../../context/TourContext';

function AddTourPage(props) {
  const navigate = useNavigate();
  const { addTour } = useContext(TourContext);
  const [activeField, setActiveField] = useState(false);
  const [values, setValues] = useState({
    tourName: '',
    departureLocation: '',
    destination: '',
    duration: 0,
    departureDate: '',
    returnDate: '',
    seats: 0,
    transportation: '',
    adultPrice: '0',
    childPrice: '0',
    infantPrice: '0',
    description: '',
    itinerary: [],
  });
  

  const [scheduleList, setScheduleList] = useState([]);

  const deleteSchedule = (id) => {
    console.log('id bi xoa', id);
    const updatedList = scheduleList
      .filter((schedule) => schedule.id !== id)
      .map((schedule, index) => ({ ...schedule, day_number: index + 1 }));
    setScheduleList(updatedList);
    setValues({...values, itinerary: updatedList});
  };
  
  const handleActiveField = () => {
    console.log('activeField', activeField);
    setActiveField(!activeField);
  }


  const addSchedule = (schedule) => {
    const newSchedule = {
      id: uuidv4().replace(/-/g, '').slice(0, 10),
      day_number: scheduleList.length + 1,
      tour_route: schedule.tour_route,
      description: schedule.description
    }
    const updatedItinerary = [...scheduleList, newSchedule];
    setScheduleList(updatedItinerary);
    setValues({...values, itinerary: updatedItinerary});
  }
 
  const [selectedImages, setSelectedImages] = useState([]);
  const [displayImages, setDisplayImages] = useState([]);
  const imageCount = displayImages.length;

  const optionList = [
    {value: 'TP HCM'},
    {value: 'Hà Nội'},
    {value: 'Đà Nẵng'},
  ];
 
  // Thiết lập sensors cho desktop và mobile
   // Thiết lập sensors cho desktop và mobile
   const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Xử lý khi kéo thả kết thúc
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id === over.id) return;
    
    if (active.id !== over.id) {
      setScheduleList((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        // Cập nhật day_number dựa trên vị trí mới
        return newItems.map((item, index) => ({
          ...item,
          day_number: index + 1,
        }));
      });
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    let newValues = { ...values, [name]: value };

    if (name === 'departureDate' || name === 'returnDate') {
      const departureDate = name === 'departureDate' ? value : values.departureDate;
      const returnDate = name === 'returnDate' ? value : values.returnDate;
      newValues.duration = calculateDuration(departureDate, returnDate);
      newValues.itinerary = [];
    }
    setValues(newValues);
  };


  const calculateDuration = (departureDate, returnDate) => {
    if (departureDate && returnDate) {
      const departureD = new Date(departureDate);
      const returnD = new Date(returnDate);

      // Kiểm tra định dạng ngày hợp lệ
      if (isNaN(departureD.getTime()) || isNaN(returnD.getTime())) {
        return 'Ngày không hợp lệ';
      }

      departureD.setHours(0, 0, 0, 0);
      returnD.setHours(0, 0, 0, 0);

      const duration = returnD - departureD;
      const durationDay = Math.ceil(duration / (1000 * 60 * 60 * 24));

      if (durationDay <= 0) {
        return 'Ngày khởi hành phải sau ngày trở về';
      }

      return durationDay+1;
    }
    return 0; // Giá trị mặc định nếu chưa nhập đủ ngày
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files) {
      processFiles(files);
    }
  };

  // Process files function to handle both input and drop events
  const processFiles = (files) => {
    const newImages = [];
    const newUrls = [];
    
    // Check if each file is an image
    Array.from(files).forEach(file => {
      if (file.type.match('image.*')) {
        newImages.push(file);
        newUrls.push(URL.createObjectURL(file));
      } else {
        alert('Chỉ chấp nhận file ảnh. File "' + file.name + '" không phải là ảnh.');
      }
    });
    
    // Check if we would exceed the maximum of 5 images
    if (selectedImages.length + newImages.length > 5) {
      alert('Chỉ được phép tải lên tối đa 5 ảnh.');
      return;
    }
    
    setSelectedImages([...selectedImages, ...newImages]);
    setDisplayImages([...displayImages, ...newUrls]);
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...selectedImages];
    const updatedDisplayImages = [...displayImages];
    
    URL.revokeObjectURL(updatedDisplayImages[index]);
    
    updatedImages.splice(index, 1);
    updatedDisplayImages.splice(index, 1);
    
    setSelectedImages(updatedImages);
    setDisplayImages(updatedDisplayImages);
  };

  const handelAddTour = () => {
    console.log('values', values);
  }

  return (
    <>
    <h2 style={{color: '#339688', fontWeight: 'bold', marginLeft: '20px'}}>Thêm Tour Mới</h2>
    <Container className="tour-booking-form py-4">
      <Row className="mb-3 mt-3 d-flex justify-content-between align-items-center">
        <Col md={3}>
          <InputFiledIcon
            label="Tên tour"
            value={values.tourName}
            placeholder="Nhập tên tour"
            onChange={onChange}
            name="tourName"
          />
        </Col>
        <Col md={3} className="d-flex justify-content-end">
          <Button variant="danger" className="px-4 exit-button" onClick={() => navigate('/businessemployee/managetour')}>
            Thoát
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <DropDownIconBtn
            optionList={optionList}
            label="Điểm xuất phát"
            value={values.departureLocation}
            onChange={onChange}
            name="departureLocation"
            icon={FaLocationDot}
          />
        </Col>
        <Col md={4}>
          <InputFieldIcon2
            label="Điểm đến"
            value={values.destination}
            icon={FaLocationDot}
            placeholder="Nhập điểm đến"
            onChange={onChange}
            name="destination"
          />
        </Col>
        <Col md={4}>
        <InputFieldIcon2
            label="Thời gian"
            value={`${values.duration} ngày ${(values.duration === 0) ? '' : `${values.duration-1} đêm`}`}
            icon={FaClock}
            onChange={onChange}
            name="duration"
            readOnly={true}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={3}>
          <DatePicker
            label="Ngày khởi hành"
            value={values.departureDate}
            name="departureDate"
            onChange={onChange}
          />
        </Col>
        <Col md={3}>
        <DatePicker
            label="Ngày trở về"
            value={values.returnDate}
            name="returnDate"
            onChange={onChange}
          />
        </Col>
        <Col md={2}>
          <CouterInput
            label="Số lượng chỗ"
            value={values.seats}
            onChange={onChange}
            name="seats"
          />
        </Col>
        <Col md={4}>
        <InputFieldIcon2
            label="Phương tiện"
            value={values.transportation}
            icon={FaCar}
            placeholder="Nhập phương tiện"
            onChange={onChange}
            name="transportation"
          />
        </Col>
      </Row>

      <Container className="price-section mt-4 mb-3">
        <h5>Chọn Giá:</h5>
        <Row>
            <PriceSection
            adultPrice={values.adultPrice}
            childPrice={values.childPrice}
            infantPrice={values.infantPrice}
            onChange={onChange}
            step={100000}
          />
        </Row>
      </Container>

      <Form.Group className="mb-3">
        <Form.Label className="text-secondary">Mô tả</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={values.description}
          onChange={onChange}
          name="description"
          className="description-box"
        />
      </Form.Group>

      <div className="image-section mb-3">
        <Form.Label className="text-secondary">Ảnh đã chọn ({imageCount}/5)</Form.Label>
        <Container className="selected-images">
          <Row>
            {displayImages.map((image, index) => (
              <Col key={index} xs={6} md={2} className="mb-2">
                <div className="position-relative image-container">
                  <img src={image} alt={`Selected ${index + 1}`} className="img-thumbnail" />
                  <Button 
                    variant="light" 
                    size="sm" 
                    className="position-absolute top-0 end-0 rounded-circle delete-btn"
                    onClick={() => removeImage(index)}
                  >
                    <MdCancel size={25}/>
                  </Button>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
        
        <div className="add-images mt-3">
          <Form.Label className="mb-0">Thêm ảnh</Form.Label>
          <div 
            className="upload-area p-3 mt-2"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            
          >
            <div className="text-center">
              <p className="text-muted mb-0">Chọn ảnh từ máy hoặc kéo thả</p>
              <Form.Control
                type="file"
                multiple
                onChange={handleImageUpload}
                className="d-none"
                id="imageUpload"
                accept="image/*"
              />
              <label htmlFor="imageUpload" className="btn btn-outline-secondary mt-2">
                Chọn ảnh
              </label>
            </div>
          </div>
        </div>
      </div>
      {/* Vùng thêm lịch trình */}
      <Container className="schedule-section">
        <Row >
          <Col md={9}>
            <h3>Lịch trình</h3>
          </Col>
          <Col md={3} className="d-flex justify-content-end">
            <Button 
              variant="dark" 
              className="d-flex align-items-center gap-2" 
              onClick={handleActiveField}
              disabled={values.duration === 0 || scheduleList.length === values.duration}
              >
              <CiCirclePlus size={24}/>
               Thêm lịch trình 
            </Button>
          </Col>
        </Row>
        <Row className="mt-3">
          <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={scheduleList.map((schedule) => schedule.id)}
                strategy={verticalListSortingStrategy}
              >
                {scheduleList.map((schedule) => (
                  <Schedule key={schedule.id} schedule={schedule} onDeleteSchedule={deleteSchedule} />
                ))}
            </SortableContext>
          </DndContext>
        </Row>
      </Container>
      <Button variant="success" className="mt-3 p-20-50" style={{display: "block",marginLeft: 'auto'} } onClick={handelAddTour}>Thêm Tour</Button> 
      
        {activeField && (
          <AddShedule setActiveField={setActiveField} addSchedule={addSchedule} scheduleLength={scheduleList.length}/>
        )}
      
    </Container>
    {activeField && (
            <div 
                className="overlay"
            />
        )}
    </>
  );
}

export default AddTourPage;