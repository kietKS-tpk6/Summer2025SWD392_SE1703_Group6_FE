import React from 'react';
import { List, Tag, Tooltip } from 'antd';

export const managerAlertTasks = [
    {
      type: "class_approval",
      message: "📌 Lớp 'Trung cấp 2B' đủ điều kiện mở, cần được duyệt.",
      deadline: "2025-07-10",
      severity: "warning", // warning / info / urgent
    },
    {
      type: "low_enrollment",
      message: "⚠️ Lớp 'Sơ cấp 1A' sắp tới ngày khai giảng nhưng chưa đủ học viên.",
      deadline: "2025-07-12",
      severity: "urgent",
    },
    {
      type: "test_event_missing",
      message: "📝 Đề kiểm tra 'Midterm' của lớp 'Cao cấp 3C' cần cập nhật thông tin.",
      deadline: "2025-07-09",
      severity: "info",
    },
    {
      type: "test_not_reviewed",
      message: "🧐 Có 14 đề kiểm tra đang chờ được phê duyệt.",
      deadline: null,
      severity: "warning",
    },
    {
      type: "payment_pending",
      message: "💰 Có 3 giao dịch thanh toán đang chờ xử lý hoàn tiền.",
      deadline: null,
      severity: "info",
    }
  ];
  

const severityColor = {
  info: 'blue',
  warning: 'gold',
  urgent: 'red',
};

const ManagerAlertTasksList = ({ data = managerAlertTasks }) => {
  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px 0 rgba(24,144,255,0.04)', padding: 20, minHeight: 220 }}>
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16, color: '#1890ff' }}>Danh sách cảnh báo</div>
      <List
        dataSource={data}
        locale={{ emptyText: <span style={{ color: '#bbb' }}>Không có cảnh báo nào</span> }}
        renderItem={item => (
          <List.Item style={{ alignItems: 'flex-start', padding: '12px 0', border: 'none' }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 16 }}>{item.message}</span>
              {item.deadline && (
                <Tooltip title="Hạn xử lý">
                  <Tag color="volcano" style={{ marginLeft: 8, fontWeight: 500 }}>
                    Hạn: {item.deadline}
                  </Tag>
                </Tooltip>
              )}
            </div>
            <Tag color={severityColor[item.severity]} style={{ fontWeight: 600, minWidth: 70, textAlign: 'center' }}>
              {item.severity === 'urgent' ? 'Khẩn cấp' : item.severity === 'warning' ? 'Cảnh báo' : 'Thông báo'}
            </Tag>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ManagerAlertTasksList; 