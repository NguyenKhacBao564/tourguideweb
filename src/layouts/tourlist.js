import React, { useEffect } from 'react';
import Tourcard from '../components/tourcard';
// import tourdata from '../data/db';
function Tourlist(props) {
    const [tours, setTours] = React.useState([]);

    useEffect(() => {
        const fetchTours = async () => {
            const tourlist = await fetch('http://localhost:3004/tour');
            const data= await tourlist.json();
            // console.log(tourlist.json());
            setTours(data);
        }
        fetchTours();
        
    }, []);

    return (
        <div className='tourlist'>
          {tours.map(tour => (
                <Tourcard key={tour.id} {...tour}/>
            ))}
        </div>
    );
}

export default Tourlist;