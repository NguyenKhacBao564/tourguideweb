import React from 'react';
import Maincontent from '../../layouts/MainContent';
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer/Footer';
import { Link } from 'react-router-dom';
import { useWindowSize } from "../../windowsize";

function Page(props) {
  const { width, height } = useWindowSize();
  return (
    <div>
      <Header />
      <Maincontent />
      <Link to="/admin/khachhang">Admin</Link>
      <Footer />
    </div>
  );
}

export default Page;