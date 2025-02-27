import React from 'react';
import Maincontent from './maincontent';
import Header from './header';
function Page(props) {
    return (
        <div>
          <Header/>
          <Maincontent/>  
        </div>
    );
}

export default Page;