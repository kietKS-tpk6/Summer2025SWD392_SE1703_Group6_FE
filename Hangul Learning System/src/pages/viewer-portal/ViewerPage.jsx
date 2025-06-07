import React from 'react';
import { motion } from 'framer-motion';
import HeaderBar from '../../components/header/Header';
import FooterBar from '../../components/footer/Footer';
import Content from '../../components/Homepage/Content';
import '../../styles/Content.css';


function ViewerPage() {
  return (
    <div className="viewer-page">
      <HeaderBar />
        <Content />
      <FooterBar />
    </div>
  );
}

export default ViewerPage;