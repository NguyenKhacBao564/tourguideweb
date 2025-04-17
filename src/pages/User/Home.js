import React from 'react';
import Maincontent from '../../layouts/MainContent';
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';
import { Link } from 'react-router-dom';


function Page(props) {
    
    return (
        <div>
          <Header/>
          <Maincontent/>
          <Link to="/businessemployee/managetour">Admin</Link>
          <Footer/>
        </div>
    );
}

export default Page;