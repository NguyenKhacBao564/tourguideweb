import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faUser, faCalendarDays} from "@fortawesome/free-solid-svg-icons";
import styles from  "./SearchBar.module.scss";
const Searchbar = (props) => {
    return (
        <div className={styles.searchbarContainer}>
            <div>
                <div className={styles.searchItem}>
                    <span className={styles.searchLabel}>
                        <FontAwesomeIcon icon={faLocationDot} className={styles.icon} />
                        Location
                    </span>
                    <input type="text" placeholder="Search For A Destination" className={styles.searchInput} />
                </div>
            </div>
            <div className={styles.separator}></div>

            <div>
                <div className={styles.searchItem}>
                    <span className={styles.searchLabel}>
                    <FontAwesomeIcon icon={faUser} className={styles.icon}/>
                        Guests
                    </span>
                    <input type="text" placeholder="How many Guests?" className={styles.searchInput} />
                </div>
            </div>
            
            <div className={styles.separator}></div>

            <div>
                <div className={styles.searchItem}>
                    <span className={styles.searchLabel}>
                    <FontAwesomeIcon icon={faCalendarDays} className={styles.icon}/>
                        Date
                    </span>
                    <input type="date" className={styles.searchInput} /> 
                </div>
            </div>
            <button className={styles.searchButton}>Search</button>
        </div>
    );
}

export default Searchbar;