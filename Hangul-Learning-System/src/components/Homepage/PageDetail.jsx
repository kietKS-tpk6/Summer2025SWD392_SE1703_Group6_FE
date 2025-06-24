import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import graphicImg from '../../assets/graphic.png';
import globalsystemImg from '../../assets/global.png';
import citImg from '../../assets/cit.png';
import webdevImg from '../../assets/webdev.png';
import artImg from '../../assets/art.png';
import musicImg from '../../assets/music.png';
import techinfoImg from '../../assets/techinfo.png';
import datascienceImg from '../../assets/datascience.png';

const pagesContent = [
  {
    id: 1,
    imageURL: graphicImg,
    title: "Photoshop CC 2018 Essential Training: The Basics",
    course: "Graphics Design",
  },
  {
    id: 2,
    imageURL: globalsystemImg,
    title: "Get Started Coding Android Apps With Kotlin",
    course: "Global System",
  },
  {
    id: 3,
    imageURL: citImg,
    title: "Create Turntable Animations With Cinema 4D",
    course: "Computer & Information Technology",
  },
  {
    id: 4,
    imageURL: webdevImg,
    title: "A Beginner's Guide to the New Bootstrap 4 Grid",
    course: "Web Development",
  },
  {
    id: 5,
    imageURL: artImg,
    title: "A Designer's Guide to Vue.js Components",
    course: "Art Departments",
  },
  {
    id: 6,
    imageURL: musicImg,
    title: "Code a Swift App With Realm Mobile Database",
    course: "Music",
  },
  {
    id: 7,
    imageURL: techinfoImg,
    title: "10 Essential Design Tips in Adobe Illustrator",
    course: "Technology Information",
  },
  {
    id: 8,
    imageURL: datascienceImg,
    title: "Modern PHP From The Beginning",
    course: "Data Science",
  }
];

const PageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const page = pagesContent.find(item => item.id === Number(id));

  if (!page) return <div style={{padding: 40}}>Không tìm thấy nội dung.</div>;

  return (
    <div className="app__page-detail" style={{maxWidth: 800, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #eee', padding: 32}}>
      <button onClick={() => navigate(-1)} style={{marginBottom: 24, background: '#eee', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer'}}>Quay lại</button>
      <img src={page.imageURL} alt={page.title} style={{width: '100%', borderRadius: 12, marginBottom: 24}} />
      <h1 className="head-text" style={{marginBottom: 12}}>{page.title}</h1>
      <h3 style={{color: '#888', marginBottom: 24}}>{page.course}</h3>
      <div className="p-text" style={{fontSize: 18, lineHeight: 1.7}}>
        Đây là trang chi tiết cho khoá học <b>{page.title}</b> thuộc chuyên ngành <b>{page.course}</b>.<br/><br/>
        (Bạn có thể thêm nội dung chi tiết thực tế ở đây tuỳ ý)
      </div>
    </div>
  );
};

export default PageDetail; 