import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, QrCode, CreditCard, ArrowLeft } from 'lucide-react';

const PaymentPage = () => {
  const [paymentData, setPaymentData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [loading, setLoading] = useState(true);

  // Mock data - thay thế bằng dữ liệu thực từ API
  useEffect(() => {
    // Simulate API call to get payment data
    const mockPaymentData = {
      paymentId: 'PM0001',
      classId: 'CL0001',
      className: 'Korean Basic Level 1',
      total: 500000,
      checkoutUrl: 'https://pay.payos.vn/web/example-checkout-url',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      description: 'Payment for Korean Basic Level 1',
      dayCreate: new Date().toISOString()
    };

    setTimeout(() => {
      setPaymentData(mockPaymentData);
      setLoading(false);
    }, 1000);
  }, []);

  // Check payment status every 5 seconds
  useEffect(() => {
    if (!paymentData) return;

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/payment/status/${paymentData.paymentId}`);
        const data = await response.json();
        setPaymentStatus(data.status.toLowerCase());
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    };

    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [paymentData]);

  // Countdown timer
  useEffect(() => {
    if (paymentStatus !== 'pending') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setPaymentStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentStatus]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handlePayWithPayOS = () => {
    if (paymentData?.checkoutUrl) {
      window.open(paymentData.checkoutUrl, '_blank');
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (paymentStatus === 'paid') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h2>
          <p className="text-gray-600 mb-6">Bạn đã đăng ký khóa học thành công</p>
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-700">
              <strong>{paymentData?.className}</strong>
            </p>
            <p className="text-lg font-bold text-green-800">
              {formatCurrency(paymentData?.total)}
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Đi đến khóa học của tôi
          </button>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'expired') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Phiên thanh toán đã hết hạn</h2>
          <p className="text-gray-600 mb-6">Vui lòng tạo lại đơn thanh toán mới</p>
          <button
            onClick={handleGoBack}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleGoBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Quay lại
            </button>
            <div className="flex items-center text-orange-600">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-bold text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Thanh toán khóa học</h1>
            <p className="text-gray-600">Quét mã QR hoặc nhấn nút thanh toán để hoàn tất</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Payment Info */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Thông tin thanh toán</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Mã thanh toán:</span>
                <span className="font-semibold text-gray-800">{paymentData?.paymentId}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Khóa học:</span>
                <span className="font-semibold text-gray-800 text-right max-w-xs">
                  {paymentData?.className}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-bold text-2xl text-indigo-600">
                  {formatCurrency(paymentData?.total)}
                </span>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-4 mt-6">
                <p className="text-sm text-indigo-700 text-center">
                  Vui lòng thanh toán trong vòng {formatTime(timeLeft)} để hoàn tất đăng ký
                </p>
              </div>
            </div>
          </div>

          {/* QR Code & Payment Button */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Quét mã QR để thanh toán</h2>
              
              {/* QR Code */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="w-64 h-64 mx-auto bg-white rounded-lg shadow-inner flex items-center justify-center">
                  {paymentData?.qrCode ? (
                    <img 
                      src={paymentData.qrCode} 
                      alt="Payment QR Code"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-center text-grnay-400">
                      <QrCode className="w-16 h-16 mx-auto mb-2" />
                      <p>QR Code đang tải...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayWithPayOS}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <CreditCard className="w-6 h-6 inline-block mr-2" />
                Thanh toán với PayOS
              </button>

              <p className="text-sm text-gray-500 mt-4">
                Hoặc quét mã QR bằng ứng dụng ngân hàng của bạn
              </p>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mt-6">
          <div className="flex items-center justify-center space-x-4">
            <div className={`w-3 h-3 rounded-full ${paymentStatus === 'pending' ? 'bg-orange-400 animate-pulse' : 'bg-gray-300'}`}></div>
            <span className="text-gray-600">Đang chờ thanh toán...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;