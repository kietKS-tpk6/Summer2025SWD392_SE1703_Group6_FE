import React from 'react';
import HeaderBar from '../../components/header/Header';
import Content from '../../components/Homepage/Content';
import FooterBar from '../../components/footer/Footer';


function StudentPage() {
  return (
    <div className="Student-page">
      <HeaderBar />
        <Content />
      <FooterBar />
    </div>
  );
}

export default StudentPage; 