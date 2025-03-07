import React from 'react';
import Maincontent from '../layouts/MainContent';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';

function Page(props) {
    return (
        <div>
          <Header/>
          <Maincontent/>
          <Footer/>
        </div>
    );
}

export default Page;