import React, { useState } from 'react';
import {Container, Row, Col, Button, InputGroup} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputFiledIcon from '../../../components/InputFieldIcon/InputFieldIcon';
import InputFieldIcon2 from '../../../components/InputFieldIcon/InputFieldIcon2';
import PriceSection from '../../../components/PriceSelector/PriceSection';
import AddShedule from './components/AddShedule';
import Schedule from './components/Schedule';
import { FaClock } from "react-icons/fa6";
import { CiCirclePlus } from "react-icons/ci";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaLocationDot } from "react-icons/fa6";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import DatePicker from '../../../components/DatePicker/DatePicker';
import CouterInput from '../../../components/CounterInput/CouterInput';
import DropDownIconBtn from '../../../components/DropDownIcon/DropDownIconBtn';
import { FaCar } from "react-icons/fa";
import { v4 as uuidv4 } from 'uuid';
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import "./AddNewTour.scss"

function AddTourPage(props) {
  const [activeField, setActiveField] = useState(false);
  // const [value, setValue] = useState({
  //   tourName: '',
  //   departureLocation: 'TP HCM',
  //   destination: 'Đà Lạt',
  //   duration: '3 ngày 2 đêm',
  //   departureDate: '25/09/2025',
  //   returnDate: '25/09/2025',
  //   seats: 100,
  //   transportation: 'Xe khách',
  // });
  const [tourName, setTourName] = useState('');
  const [departureLocation, setDepartureLocation] = useState('TP HCM');
  const [destination, setDestination] = useState('Đà Lạt');
  const [duration, setDuration] = useState('3 ngày 2 đêm');
  const [departureDate, setDepartureDate] = useState('25/09/2025');
  const [returnDate, setReturnDate] = useState('25/09/2025');
  const [seats, setSeats] = useState(100);
  const [transportation, setTransportation] = useState('Xe khách');
  const [adultPrice, setAdultPrice] = useState('1.000.000');
  const [childPrice, setChildPrice] = useState('1.000.000');
  const [infantPrice, setInfantPrice] = useState('1.000.000');
  
  const [formData, setFormData] = useState({
    // other form fields...
    adultPrice: '1.000.000',
    childPrice: '500.000',
    infantPrice: '200.000'
  });

  // Trong AddTourPage.js
  const deleteSchedule = (id) => {
    console.log('id bi xoa', id);
    const updatedList = scheduleList
      .filter((schedule) => schedule.id !== id)
      .map((schedule, index) => ({ ...schedule, day_number: index + 1 }));
    setScheduleList(updatedList);
  };
  const handleActiveField = () => {
    console.log('activeField', activeField);
    setActiveField(!activeField);
  }

  const closeOverlay = () => {
    setActiveField(false);
  }

  const [scheduleList, setScheduleList] = useState([
  ]);

  const addSchedule = (schedule) => {
    setScheduleList([...scheduleList, {
      id: uuidv4().replace(/-/g, '').slice(0, 10),
      day_number: scheduleList.length + 1,
      tour_route: schedule.tour_route,
      description: schedule.description
    }])
  }
  console.log('scheduleList', scheduleList);
  const [description, setDescription] = useState(
    'Đà Lạt – thành phố ngàn hoa, điểm đến lý tưởng cho những ai yêu thích không khí se lạnh, cảnh quan thơ mộng và những trải nghiệm đầy thú vị. Đến với Đà Lạt bạn sẽ được đắm chìm trong vẻ đẹp lãng mạn của hồ Xuân Hương, khám phá những đồi chè xanh bát ngát, thác nước hùng vĩ và những cảnh đồng hoa rực rỡ sắc màu. Không chỉ vậy, Đà Lạt còn hấp dẫn du khách với nền ẩm thực độc đáo, từ bánh tráng nướng giòn rụm đến ly sữa đậu nành nóng hổi giữa trời đêm se lạnh. Hãy cùng chúng tôi tận hưởng hành trình khám phá Đà Lạt đầy ấn tượng và đáng nhớ!'
  );
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
    // useSensor(TouchSensor, {
    //   coordinateGetter: sortableKeyboardCoordinates,
    // })
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      setSelectedImages([...selectedImages, ...newImages]);
      
      // Create image URLs for display
      const newUrls = newImages.map(file => URL.createObjectURL(file));
      setDisplayImages([...displayImages, ...newUrls]);
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

  // For demo purposes, let's use the sample images from the mockup
  React.useEffect(() => {
    // Initialize with sample images for demonstration
    setDisplayImages([
      '/lovable-uploads/e8d10b84-cc41-4183-b163-5e8ee01c8e9b.png',
      'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=500&auto=format&fit=crop&q=60'
    ]);
  }, []);

  return (
    <>
    <h2 style={{color: '#339688', fontWeight: 'bold', marginLeft: '20px'}}>Thêm Tour Mới</h2>
    <Container className="tour-booking-form py-4">
     
      <Row className="mb-3 mt-3 d-flex justify-content-between align-items-center">
        <Col md={3}>
          <InputFiledIcon
            label="Tên tour"
            value={tourName}
            placeholder="Nhập tên tour"
            onChange={(e) => setTourName(e.target.value)}
          />
        </Col>
        <Col md={3} className="d-flex justify-content-end">
          <Button variant="danger" className="px-4 exit-button">
            Thoát
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <DropDownIconBtn
            optionList={optionList}
            label="Điểm xuất phát"
            value={departureLocation}
            onChange={(e) => setDepartureLocation(e.target.value)}
            icon={FaLocationDot}
          />
        </Col>
        <Col md={4}>
          <InputFieldIcon2
            label="Điểm đến"
            value={destination}
            icon={FaLocationDot}
            placeholder="Nhập điểm đến"
            onChange={(e) => setDestination(e.target.value)}
          />
        </Col>
        <Col md={4}>
        <InputFieldIcon2
            label="Thời gian"
            value={duration}
            icon={FaClock}
            placeholder="Nhập thời gian"
            onChange={(e) => setDuration(e.target.value)}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={3}>
          <DatePicker
            label="Ngày khởi hành"
            value={departureDate}
            name="departureDate"
            onChange={(e) => setDepartureDate(e.target.value)}
          />
        </Col>
        <Col md={3}>
        <DatePicker
            label="Ngày trở về"
            value={returnDate}
            name="returnDate"
            onChange={(e) => setReturnDate(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <CouterInput
            label="Số lượng chỗ"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
          />
        </Col>
        <Col md={3}>
        <InputFieldIcon2
            label="Phương tiện"
            value={transportation}
            icon={FaCar}
            placeholder="Nhập phương tiện"
            onChange={(e) => setTransportation(e.target.value)}
          />
        </Col>
      </Row>

      <Container className="price-section mt-4 mb-3">
        <h5>Chọn Giá:</h5>
        <Row>
            <PriceSection
            adultPrice={formData.adultPrice}
            childPrice={formData.childPrice}
            infantPrice={formData.infantPrice}
            onChange={handleChange}
            step={100000}
          />
        </Row>
      </Container>

      <Form.Group className="mb-3">
        <Form.Label className="text-secondary">Mô tả</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
          <div className="upload-area p-3 mt-2">
            <div className="text-center">
              <p className="text-muted mb-0">Chọn ảnh từ máy hoặc kéo thả</p>
              <Form.Control
                type="file"
                multiple
                onChange={handleImageUpload}
                className="d-none"
                id="imageUpload"
              />
              <label htmlFor="imageUpload" className="btn btn-outline-secondary mt-2">
                Chọn ảnh
              </label>
            </div>
          </div>
        </div>
      </div>



      <Container className="schedule-section">
        <Row >
          <Col md={9}>
            <h3>Lịch trình</h3>
          </Col>
          <Col md={3} className="d-flex justify-content-end">
            <Button variant="dark" className="d-flex align-items-center gap-2" onClick={handleActiveField}><CiCirclePlus size={24}/> Thêm lịch trình</Button>
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
      <Button variant="success" className="mt-3 p-20-50" style={{display: "block",marginLeft: 'auto'}}>Thêm Tour</Button> 
      
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