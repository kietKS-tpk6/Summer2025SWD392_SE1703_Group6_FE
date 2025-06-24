import React from 'react';
import ClassCard from '../class/ClassCard';

// Data mẫu các lớp đã đăng ký
const myCoursesData = [
  {
    classID: 101,
    imageURL: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80',
    className: 'Lớp Tiếng Hàn Sơ Cấp 1',
    lecturerName: 'Nguyễn Văn A',
    priceOfClass: 1200000,
    status: 1,
  },
  {
    classID: 102,
    imageURL: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    className: 'Lớp Tiếng Hàn Trung Cấp',
    lecturerName: 'Trần Thị B',
    priceOfClass: 1500000,
    status: 1,
  },
  {
    classID: 103,
    imageURL: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80',
    className: 'Lớp Luyện Thi TOPIK',
    lecturerName: 'Lê Văn C',
    priceOfClass: 1800000,
    status: 1,
  },
  {
    classID: 104,
    imageURL: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    className: 'Lớp Tiếng Hàn Cao Cấp',
    lecturerName: 'Phạm Thị D',
    priceOfClass: 2000000,
    status: 1,
  },
  {
    classID: 105,
    imageURL: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    className: 'Lớp Giao Tiếp Hàn',
    lecturerName: 'Ngô Văn E',
    priceOfClass: 1100000,
    status: 1,
  },
];

const MyCourses = () => (
  <div
    style={{
      minHeight: 'calc(100vh - 120px)',
      background: '#faf3eb',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 0',
    }}
  >
    <div style={{
      background: '#fffbe6',
      borderRadius: 24,
      boxShadow: '0 2px 24px #fbb04022',
      padding: '40px 32px',
      width: '80%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <h1 style={{marginBottom: 8}}>Khóa học của tôi</h1>
      <p style={{marginBottom: 32}}>Đây là trang hiển thị các lớp mà bạn đã đăng ký.</p>
      <div
        className="my-courses-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 32,
          width: '100%',
          justifyItems: 'center',
        }}
      >
        {myCoursesData.length === 0 ? (
          <div>Bạn chưa đăng ký lớp học nào.</div>
        ) : (
          myCoursesData.map((item) => (
            <ClassCard
              key={item.classID}
              id={item.classID}
              imageURL={item.imageURL}
              className={item.className}
              lecturerName={item.lecturerName}
              priceOfClass={item.priceOfClass}
              status={item.status}
              hidePriceAndStatus={true}
            />
          ))
        )}
      </div>
    </div>
  </div>
);

export default MyCourses; 