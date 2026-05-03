import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);
  
  // --- PHẦN BỔ SUNG: State cho form ---
  const [soDienThoai, setSoDienThoai] = useState('');
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
      setSoDienThoai(savedUser.soDienThoai || ''); // Hiện SĐT cũ nếu có
    } else {
      window.location.href = '/login';
    }
  }, []);

  // --- PHẦN BỔ SUNG: Hàm xử lý Cập nhật SĐT ---
  const handleUpdateProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, soDienThoai }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Thành công: " + data.message);
        // Cập nhật lại user trong localStorage và State để đồng bộ
        const updatedUser = { ...user, soDienThoai: data.user.soDienThoai };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        alert("Lỗi: " + data.error);
      }
    } catch (error) {
      alert("Lỗi kết nối server!");
    }
  };

  // --- PHẦN BỔ SUNG: Hàm xử lý Đổi mật khẩu ---
  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      return alert("Mật khẩu mới nhập lại không khớp!");
    }

    try {
      const response = await fetch('http://localhost:5000/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user.email, 
          oldPassword: passwords.oldPassword, 
          newPassword: passwords.newPassword 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Đổi mật khẩu thành công!");
        setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' }); // Xóa trắng form
      } else {
        alert("Lỗi: " + data.error);
      }
    } catch (error) {
      alert("Lỗi kết nối server!");
    }
  };

  if (!user) return <div>Đang tải...</div>;

  return (
    <div style={{ padding: '50px', maxWidth: '600px', margin: 'auto', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
      <h1 style={{ textAlign: 'center', color: '#009be5' }}>HỒ SƠ CÁ NHÂN</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <p><strong>Họ và tên:</strong> {user.hoTen}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Vai trò:</strong> {user.vaiTro || 'Khách hàng'}</p>
        </div>
        
        {/* --- CẬP NHẬT THÔNG TIN --- */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <h3>Cập nhật thông tin</h3>
          <label>Số điện thoại:</label>
          <input 
            type="text" 
            value={soDienThoai}
            onChange={(e) => setSoDienThoai(e.target.value)}
            placeholder="Nhập số điện thoại mới" 
            style={{ padding: '10px', width: '100%', marginBottom: '10px' }} 
          />
          <button 
            onClick={handleUpdateProfile}
            style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}
          >
            Lưu thay đổi
          </button>
        </div>

        {/* --- ĐỔI MẬT KHẨU --- */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <h3>Đổi mật khẩu</h3>
          <input 
            type="password" 
            placeholder="Mật khẩu hiện tại" 
            value={passwords.oldPassword}
            onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
            style={{ padding: '10px', width: '100%', marginBottom: '10px' }} 
          />
          <input 
            type="password" 
            placeholder="Mật khẩu mới" 
            value={passwords.newPassword}
            onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
            style={{ padding: '10px', width: '100%', marginBottom: '10px' }} 
          />
          <input 
            type="password" 
            placeholder="Xác nhận mật khẩu mới" 
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
            style={{ padding: '10px', width: '100%', marginBottom: '10px' }} 
          />
          <button 
            onClick={handleChangePassword}
            style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}
          >
            Đổi mật khẩu
          </button>
        </div>

        {/* --- ĐĂNG XUẤT --- */}
        <button 
          onClick={() => {
            localStorage.removeItem('user');
            alert("Đã đăng xuất thành công!");
            window.location.href = '/login';
          }}
          style={{ 
            marginTop: '20px', 
            padding: '12px', 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            width: '100%',
            fontWeight: 'bold',
            cursor: 'pointer',
            borderRadius: '5px'
          }}
        >
          ĐĂNG XUẤT TÀI KHOẢN
        </button>
      </div>
    </div>
  );
};

export default Profile;