import React from 'react';
import Maincontent from '../../layouts/MainContent';
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer/Footer';

import { useWindowSize } from "../../windowsize";

function Page(props) {
    const { width, height } = useWindowSize();
    return (
        <div>
             {/* <div style={{position:"fixed", top: 50, left: 0, backgroundColor: "transparent", padding: "10px", zIndex: 1000}}>
                <p>Chiều rộng: {width}px</p>
                <p>Chiều cao: {height}px</p>
              </div> */}
          <Header/>
          <Maincontent/>
          <Footer/>
        </div>
    );
}

export default Page;