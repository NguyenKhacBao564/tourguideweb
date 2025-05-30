import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faUser, faCalendarDays, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./SearchBar.module.scss";
import SearchbarMobile from "./SearchbarMobile";
import {useNavigate}   from "react-router-dom";
const Searchbar = (props) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navigate = useNavigate();
    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    return (
        <div className={styles.searchbarContainer}>
            <div className={styles.searchbarMobile}>
                <SearchbarMobile />
            </div>
            {/* Mobile Search Toggle Button */}
           

            {/* Search Form */}
            <div className={styles.searchForm}>
                <div className={styles.searchItem}>
                    <span className={styles.searchLabel}>
                        <FontAwesomeIcon icon={faLocationDot} className={styles.icon} />
                        Location
                    </span>
                    <input type="text" placeholder="Search For A Destination" className={styles.searchInput} />
                </div>

                <div className={styles.separator}></div>

                <div className={styles.searchItem}>
                    <span className={styles.searchLabel}>
                        <FontAwesomeIcon icon={faUser} className={styles.icon}/>
                        Guests
                    </span>
                    <input type="text" placeholder="How many Guests?" className={styles.searchInput} />
                </div>
                
                <div className={styles.separator}></div>

                <div className={styles.searchItem}>
                    <span className={styles.searchLabel}>
                        <FontAwesomeIcon icon={faCalendarDays} className={styles.icon}/>
                        Date
                    </span>
                    <input type="date" className={styles.searchInput} /> 
                </div>

                <button className={styles.searchButton} onClick={()=> navigate("/findtour")}>Search</button>
            </div>
        </div>
    );
}

export default Searchbar;