import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
    } else {
      window.location.href = '/login'; // Chưa đăng nhập thì bắt về trang Login
    }
  }, []);

  if (!user) return <div>Đang tải...</div>;

  return (
    <div style={{ padding: '50px', maxWidth: '600px', margin: 'auto', border: '1px solid #ddd' }}>
      <h1>HỒ SƠ CÁ NHÂN</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <p><strong>Họ và tên:</strong> {user.hoTen}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Vai trò:</strong> {user.vaiTro || 'Khách hàng'}</p>
        
        <div style={{ borderTop: '1px solid #eee', pt: '20px' }}>
          <h3>Cập nhật thông tin</h3>
          <label>Số điện thoại:</label>
          <input type="text" placeholder="Nhập số điện thoại mới" style={{ padding: '10px', width: '100%' }} />
          <button style={{ marginTop: '10px', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
            Lưu thay đổi
          </button>

          

          <button 
            onClick={() => {
              localStorage.removeItem('user');
              alert("Đã đăng xuất thành công!");
              window.location.href = '/login';
            }}
            style={{ 
              marginTop: '20px', 
              padding: '10px', 
              backgroundColor: '#dc3545', // Màu đỏ cho nổi bật
              color: 'white', 
              border: 'none', 
              width: '100%',
              cursor: 'pointer' 
            }}
          >
            ĐĂNG XUẤT TÀI KHOẢN
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;