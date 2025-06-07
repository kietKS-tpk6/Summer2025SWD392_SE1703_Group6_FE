import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Service1 from '../../assets/Service1.png';
import Service2 from '../../assets/Service2.png';
import Service3 from '../../assets/Service3.png';
import bg from '../../assets/Background.png';
import aboutImg from '../../assets/about.png';
import leafImg from '../../assets/leaf.png';
import { FaPlay } from 'react-icons/fa';
import graphicImg from '../../assets/graphic.png';
import globalsystemImg from '../../assets/global.png';
import citImg from '../../assets/cit.png';
import webdevImg from '../../assets/webdev.png';
import artImg from '../../assets/art.png';
import musicImg from '../../assets/music.png';
import techinfoImg from '../../assets/techinfo.png';
import datascienceImg from '../../assets/datascience.png';

const Services = [
  {
    imageURL: Service1,
    title: 'Online Education',
    color: '#f9703a',
  },
  {
    imageURL: Service2,
    title: 'Online Education',
    color: '#80be41',
  },
  {
    imageURL: Service3,
    title: 'Online Education',
    color: '#ffb258',
  },
];

const Numbers = [
  { count: '4000', name: 'Students', color: '#ffba00' },
  { count: '260', name: 'Courses', color: '#ff5f72' },
  { count: '5679', name: 'Hours Video', color: '#43cb83' }
];

const pagesContent = [
  {
    imageURL: graphicImg,
    title: "Photoshop CC 2018 Essential Training: The Basics",
    course: "Graphics Design",
    src: '#'
  },
  {
    imageURL: globalsystemImg,
    title: "Get Started Coding Android Apps With Kotlin",
    course: "Global System",
    src: '#'
  },
  {
    imageURL: citImg,
    title: "Create Turntable Animations With Cinema 4D",
    course: "Computer & Information Technology",
    src: '#'
  },
  {
    imageURL: webdevImg,
    title: "A Beginner's Guide to the New Bootstrap 4 Grid",
    course: "Web Development",
    src: '#'
  },
  {
    imageURL: artImg,
    title: "A Designer's Guide to Vue.js Components",
    course: "Art Departments",
    src: '#'
  },
  {
    imageURL: musicImg,
    title: "Code a Swift App With Realm Mobile Database",
    course: "Music",
    src: '#'
  },
  {
    imageURL: techinfoImg,
    title: "10 Essential Design Tips in Adobe Illustrator",
    course: "Technology Information",
    src: '#'
  },
  {
    imageURL: datascienceImg,
    title: "Modern PHP From The Beginning",
    course: "Data Science",
    src: '#'
  }
];

const Content = () => {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false); 
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
          <h1>
            Innovation for education <br />
            and society
          </h1>
          <p>
            Our interdisciplinary majors and minors mean you can
            chart your own course for academic success.
          </p>
          <button className="app__home-btn" onClick={handleApplyNow}>Apply Now</button>
        </motion.div>
      </div>
      {/* Service Section */}
      <div className="app__service">
        <h1 className="head-text">Our Department</h1>
        <p className="p-text">
          A hundred thousands grateful loves to your dear papa and mamma. Is your poor brother recovered of his ract-punch? Oh, dear! Oh, How men should beware of wicked punch!
        </p>
        <motion.div
          whileInView={{ y: [-50, 0], opacity: [0, 1] }}
          transition={{ duration: 0.5 }}
          className="app__services"
        >
          {Services.map((item, idx) => (
            <div
              className="app__service-item"
              style={{ backgroundColor: item.color }}
              key={idx}
            >
              <img src={item.imageURL} alt="Service" />
              <h4>{item.title}</h4>
            </div>
          ))}
        </motion.div>
      </div>
      {/* About Section */}
      <div className='app__about'>
        <div className='app__bg-circle'/>
        <div className="app__about-decor-top"></div>
        <div className="app__about-decor-bottom"></div>
        <motion.div
          whileInView={{ y: [-50, 0], opacity: [0, 1] }}
          transition={{ duration: 0.5 }}
          className='app__about-items'>
          <div className='app__about-play'>
            <img src={aboutImg} className="app__about-play-img" alt="About"/>
            <img src={leafImg} className="app__about-leaf" alt="leaf"/>
            <button onClick={() => setOpen(true)}><FaPlay/></button>
          </div>
          <div className='app__about-info'>
          <h1 className='head-text'>Limitless learning, more <br/>possibilities</h1>
          <p className='p-text'>
            The University of Rochester is one of the country's top-tier research universities. Our campuses are home to 200 academic majors, more than 2,000 faculty and instructional staff, and some 10,000 students—approximately half of whom are women.
            <br/><br/>
            Learning at the University of Rochester is also on a very personal scale. Rochester remains one of the smallest and most collegiate among top research universities, with smaller classes, a low 10:1 student to teacher ratio, and increased interactions with faculty.
          </p>
          <div className='app__about-info-numbers'>
            {Numbers.map((item, idx) => (
              <div className='app__about-info-number' style={{color: item.color}} key={idx}>
                <h1>{item.count}</h1>
                <h4>{item.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      </div>
      {/* Pages Section */}
      <div className='app__page-section'>
        <div className='app__pages'>
          <h1 className='head-text'>Around the University</h1>
          <div className='app__page-items'>
            {pagesContent.map((item, idx) => (
              <motion.div
                whileInView={{ y: [-50, 0], opacity: [0, 1] }}
                transition={{ duration: 0.5 }}
                className="app__page-item"
                key={idx}
              >
                <img src={item.imageURL} alt="course"/>
                <a href={item.src} className='app__page-course'>{item.title}</a>
                <h6>{item.course}</h6>
                <a href={item.src} className='app__page-course-link'>Keep reading...</a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;