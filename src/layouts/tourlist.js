import React from 'react';
import Tourcard from '../components/tourcard';
import tourdata from '../data/db';
function Tourlist(props) {
    

    return (
        <div className='tourlist'>
          {tourdata.map(tour => (
                <Tourcard key={tour.id} {...tour}/>
            ))}
        </div>
    );
}

export default Tourlist;