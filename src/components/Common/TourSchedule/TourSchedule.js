import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import "./TourSchedule.scss";

function TourSchedule(props) {
    


    return (
        <Accordion alwaysOpen>
        <Accordion.Item eventKey="0" >
            <Accordion.Header><strong>Ngày 1: TP. HỒ CHÍ MINH - ĐÀ LẠT (Ăn sáng, trưa, chiều)</strong></Accordion.Header>
            <Accordion.Body>
            Đón quý khách tại văn phòng lữ hành TourGuide, khởi hành đi Đà Lạt. Đoàn dừng chân tại Samten Hills Dalat tham quan chiêm bái Đại bảo tháp Kinh Luân lớn nhất thế giới tại Việt Nam thuộc dòng Phật Giáo Kim Cương Thừa. Đến Đà Lạt, du khách nhận phòng. Tối tự do dạo thành phố Đà Lạt về đêm, thưởng thức nhịp 
sống phố núi. Nghỉ đêm tại Đà Lạt.
            </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
            <Accordion.Header><strong>Ngày 2: THAM QUAN ĐÀ LẠT (Ăn sáng, trưa, chiều)</strong></Accordion.Header>
            <Accordion.Body>
            Buổi sáng, xe đưa quý khách tham quan Puppy Farm - trang trại và vườn thú tựa trời Âu thu nhỏ, với ngôi 
nhà kho màu trắng nổi bật là nơi trú ngụ của những bé lạc đà Alpaca và ngựa lùn Pony; sân cún với các em 
cún dễ thương và vô cùng thân thiện; đồi hoa đua nhau khoe sắc, toả hương, rộng bạt ngàn với nhiều loài 
hoa khác nhau; vườn rau thuỷ canh trồng xà lách, bí thiên nga và bí ngô khổng lồ; vườn cà chua và vườn dâu công nghệ cao; vườn sen đá và xương rồng nhiều chủng loại. Đoàn ghé thăm nhà thờ Domain de Marie. Buổi chiều, xe đưa quý khách viếng Thiền Viện Trúc Lâm - là một trong 3 thiền viện lớn nhất ở Việt 
Nam thuộc dòng Trúc Lâm Yên Tử. Tham quan Quảng trường Lâm Viên với không gian rộng lớn, thoáng
mát hướng ra hồ Xuân Hương cùng công trình nghệ thuật khối bông hoa dã quỳ và khối nụ hoa Atiso khổng 
lồ được thiết kế bằng kính màu rất đẹp mắt. Nghỉ đêm tại Đà Lạt.
            </Accordion.Body>
        </Accordion.Item>
        </Accordion>
    );
}

export default TourSchedule;