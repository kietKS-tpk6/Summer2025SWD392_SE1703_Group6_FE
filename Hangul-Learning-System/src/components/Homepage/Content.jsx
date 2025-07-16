import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import bg from '../../assets/Background.png';
import aboutImg from '../../assets/about.png';
import leafImg from '../../assets/leaf.png';
import { FaPlay } from 'react-icons/fa';

import ClassCardList from '../class/ClassCardList';
import datascienceImg from '../../assets/datascience.png';

import 'swiper/css';
import 'swiper/css/navigation';


const Numbers = [
  { count: '4000', name: 'Students', color: '#ffba00' },
  { count: '260', name: 'Courses', color: '#ff5f72' },
  { count: '400', name: 'Hours Video', color: '#43cb83' }
];

const Content = () => {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false); 
  const [teachers, setTeachers] = useState([]);
  const [teacherIndex, setTeacherIndex] = useState(0);
  const teachersPerView = window.innerWidth < 700 ? 2 : 4;
  const maxIndex = Math.max(0, teachers.length - teachersPerView);

  const handleApplyNow = () => {
    navigate('/login');
  };

  return (
    <>
      {/* Home Section */}
      <div
        id="home"
        className="app__home"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <motion.div
          whileInView={{ x: [-100, 0], opacity: [0, 1] }}
          transition={{ duration: 0.5 }}
          className="app__home-intro"
        >
          <h1 className="korean-heading italic">
            한국어 학습 시스템에 오신 <br />
            것을 환영합니다
          </h1>
          <p>
            Chào mừng bạn đến với trung tâm học <br />  tiếng hàn online của chúng tôi
          </p>
          <button className="app__home-btn" onClick={handleApplyNow}>Đăng nhập để học ngay</button>
        </motion.div>
      </div>
      {/* Service Section */}
      <div className="app__service">
        <h1 className="head-text">Các Khoa Đào Tạo</h1>
        <p className="p-text">
          Hàng trăm học viên đã tin tưởng và lựa chọn trung tâm của chúng tôi để chinh phục tiếng Hàn. Hãy cùng khám phá các khoa đào tạo đa dạng và phù hợp với mọi trình độ!
        </p>
        <ClassCardList />
      </div>
      
      
      {/* About Us Section (HTML mẫu user thêm) */}
      <div className="app__aboutus-section">
        <div className="aboutus-container">
          {/* Header */}
          <div className="aboutus-header fade-in">
            <h2 className="aboutus-title">Về Chúng Tôi</h2>
            <p className="aboutus-subtitle">
              Trung tâm Hàn ngữ hàng đầu với phương pháp giảng dạy hiện đại, 
              đội ngũ giáo viên chuyên nghiệp và môi trường học tập thân thiện
            </p>
          </div>
          {/* Cards Grid */}
          <div className="aboutus-grid">
            <div className="aboutus-card fade-in">
              <div className="card-content">
                <div className="card-icon">🎯</div>
                <h3 className="card-title">Sứ Mệnh Của Chúng Tôi</h3>
                <p className="card-description">
                  Chúng tôi cam kết trở thành cầu nối giúp học viên Việt Nam tiếp cận 
                  tri thức, văn hóa và cơ hội mới thông qua việc thành thạo tiếng Hàn.
                </p>
                <ul className="card-features">
                  <li>Giảng dạy bằng phương pháp hiện đại và tương tác</li>
                  <li>Kết hợp học tập với trải nghiệm văn hóa Hàn Quốc</li>
                  <li>Hỗ trợ học viên phát triển toàn diện</li>
                  <li>Tạo cơ hội việc làm và du học</li>
                </ul>
              </div>
            </div>
            <div className="aboutus-card fade-in">
              <div className="card-content">
                <div className="card-icon">💡</div>
                <h3 className="card-title">Giá Trị Cốt Lõi</h3>
                <p className="card-description">
                  Những giá trị mà chúng tôi luôn theo đuổi và thể hiện 
                  trong mọi hoạt động giảng dạy và phục vụ học viên.
                </p>
                <ul className="card-features">
                  <li> Đặt chất lượng giảng dạy lên hàng đầu</li>
                  <li> Luôn sát cánh cùng học viên</li>
                  <li> Không ngừng đổi mới phương pháp</li>
                  <li> Quan tâm đến từng học viên</li>
                </ul>
              </div>
            </div>
          </div>
          {/* Stats Section */}
          <div className="stats-section fade-in">
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">4,000+</span>
                <span className="stat-label">Học viên tin tưởng</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">260+</span>
                <span className="stat-label">Khóa học đa dạng</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">400+</span>
                <span className="stat-label">Giảng viên chuyên nghiệp</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">95%</span>
                <span className="stat-label">Tỷ lệ hài lòng</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;