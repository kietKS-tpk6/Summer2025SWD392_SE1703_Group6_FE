import React, { useEffect } from 'react';
import { notification } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

interface NotificationProps {
  visible: boolean;
  type: 'success' | 'error';
  message: string;
  description?: string;
  onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  visible,
  type,
  message,
  description,
  onClose
}) => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (visible) {
      api[type]({
        message,
        description,
        icon: type === 'success' ? (
          <CheckCircleOutlined style={{ color: '#52c41a' }} />
        ) : (
          <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
        ),
        placement: 'topRight',
        duration: 3,
        onClose,
      });
    }
  }, [visible]);

  return <>{contextHolder}</>;
};

export default Notification;
