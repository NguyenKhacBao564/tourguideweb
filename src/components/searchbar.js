import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faUser, faCalendarDays} from "@fortawesome/free-solid-svg-icons";

function Searchbar(props) {
    return (
        <div className='searchbar-container'>
            
            <div>
                <div className="search-item">
                    <span className="search-label">
                       
                        Location
                    </span>
                    <input type="text" placeholder="Search For A Destination" className="search-input" />
                </div>
               
            </div>
            <div className="separator"></div> {/* Thêm vạch ngăn cách */}

            <div>
                <div className="search-item">
                    <span className="search-label">
                       
                        Locaion
                    </span>
                    <input type="text" placeholder="How many Guests?" className="search-input" />
                </div>
            </div>
            
            <div className="separator"></div> {/* Thêm vạch ngăn cách */}

            <div>
                <div className="search-item">
                    <span className="search-label">
                        Date
                    </span>
                    <input type="date" className="search-input" /> 
                </div>
            </div>
            <button className="search-button">Search</button>
        </div>
    );
}

export default Searchbar;