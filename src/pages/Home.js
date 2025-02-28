import React from 'react';
import Maincontent from '../layouts/MainContent';
import Header from '../layouts/Header';
function Page(props) {
    return (
        <div>
          <Header/>
          <Maincontent/>  
        </div>
    );
}

export default Page;