import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCar, faUsers} from "@fortawesome/free-solid-svg-icons";
function Tourcard(props) {

    console.log(props);
    return (
        <div className='tour-card'>
            <img src="https://images.pexels.com/photos/1658967/pexels-photo-1658967.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Phú Yên" className="tour-img"/>
            <div className="tour-info">
                <h3>{props.tourname}</h3>
                <div className="tour-details">
                    <p className="tour-duration"><FontAwesomeIcon icon={faClock} />{props.duration}</p>
                    <p><FontAwesomeIcon icon={faCar} />{props.vehicle}</p>
                    <p className="tour-people"><FontAwesomeIcon icon={faUsers} />{props.numberguest}</p>
                </div>
                <div className="tour-footer"> 
                    <div className="tour-price-container">
                        <p>Giá từ</p>
                        <p id="price">{props.price}</p>
                    </div>  
                    <button className="book-btn">Book now</button>
                </div>
            </div>            
        </div>
    );
}

export default Tourcard;