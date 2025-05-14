import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import InputFieldIcon from '../../../components/Common/InputFieldIcon/InputFieldIcon';
import DatePicker from '../../../components/Common/DatePicker/DatePicker';
import CouterInput from '../../../components/Common/Button/CounterInput/CouterInput';

function PromotionBasicInfor({values, onChange}) {
    return (
        <>
      <Row className="mb-3">
        <Col md={4}>
            <InputFieldIcon
                label="Tên khuyến mãi"
                value={values.promotionName}
                placeholder="Nhập tên khuyến mãi"
                onChange={onChange}
                name="promotionName"
                required={true}
              />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={4}>
            <InputFieldIcon
                label="Mã khuyến mãi"
                value={values.promotionCode}
                placeholder="Nhập mã khuyến mãi"
                onChange={onChange}
                name="promotionCode"
                required={true}
              />
        </Col>
        <Col md={{span: 4, offset: 1}}>
            <InputFieldIcon
                label="Mức giảm giá"
                value={values.discount}
                placeholder="Nhập mức giảm giá"
                onChange={onChange}
                name="discount"
                required={true}
              />
        </Col>
      </Row>
      <Row>
          <Col md={2}>
          <DatePicker
              label="Ngày bắt đầu"
              value={values.startDate}
              name="startDate"
              onChange={onChange}
              required={true}
            />
          </Col>
          <Col md={2}>
            <DatePicker
                label="Ngày kết thúc"
                value={values.endDate}
                name="endDate"
                onChange={onChange}
                required={true}
              />
          </Col>
          <Col md={2}>
             <CouterInput
                label="Số lượng tối đa"
                value={values.maxUse}
                onChange={onChange}
                name="maxUse"
              />
          </Col>
      </Row>
      <Row>

      </Row>
    </>
    );
}

export default PromotionBasicInfor;