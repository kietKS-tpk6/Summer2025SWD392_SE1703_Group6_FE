import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL, endpoints } from '../../config/api';
import ClassCard from '../Class/ClassCard';

const ClassCardList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_URL + endpoints.manageClass.getAll);
        const items = Array.isArray(res.data) ? res.data : (res.data.items || []);
        setClasses(items.slice(0, 4));
      } catch (err) {
        setError('Không thể tải danh sách lớp học.');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  if (loading) return <div>Đang tải lớp học...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {classes.map((item) => (
        <ClassCard
          key={item.classID}
          imageURL={item.imageURL}
          className={item.className}
          lecturerName={item.lecturerName}
          priceOfClass={item.priceOfClass}
          status={item.status}
          onView={() => alert(`Xem chi tiết lớp ${item.className}`)}
        />
      ))}
    </div>
  );
};

export default ClassCardList;