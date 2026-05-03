import './Header.css';
import React, { useState, useEffect } from 'react'; // Bổ sung useState và useEffect
import { Link } from 'react-router-dom';
import { FaUmbrellaBeach, FaCartShopping } from 'react-icons/fa6';

function Header() {
  // --- PHẦN BỔ SUNG: Quản lý trạng thái người dùng ---
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Kiểm tra xem trong máy có lưu thông tin đăng nhập không
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser)); // Nếu có thì nạp thông tin vào biến user
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user'); // Xóa thông tin người dùng khỏi máy
    setUser(null); // Cập nhật giao diện ngay lập tức về trạng thái chưa đăng nhập
    alert("Đã đăng xuất thành công!");
    window.location.href = '/login'; // Đẩy về trang Login
  };
  // ----------------------------------------------

  return (
    <header className="mainHeader">
      <div className="logo">
        <Link to="/" style={{ textDecoration: 'none', color: '#009be5', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="/logoseabreeze.png"
            alt="logo"
            style={{ width: '30px', height: '30px', objectFit: 'contain' }}
          />
          SeaBreeze
        </Link>
      </div>

      <nav className="nav-menu">
        <a href="/" className="nav-item">Trang chủ</a>
        <a href="#homestay-section" className="nav-item">Homestay</a>
        <a href="#rent-section" className="nav-item">Thuê đồ</a>
        <a href="#contact-footer" className="nav-item">Liên hệ</a>
      </nav>

      <div className="user-actions">
        <div className="cart-icon">
          <FaCartShopping />
          <span className="cart-count">0</span>
        </div>

        {/* --- PHẦN THAY ĐỔI: Kiểm tra để hiện nút tương ứng --- */}
        {user ? (
          // Nếu ĐÃ ĐĂNG NHẬP: Hiện tên (bấm vào sẽ sang trang Profile) và nút Đăng xuất
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Link to="/profile" style={{ textDecoration: 'none', color: '#333', fontWeight: '500' }}>
              Chào, {user.hoTen}
            </Link>
            <button 
              onClick={handleLogout} 
              className="btn-login" // Dùng tạm class cũ hoặc tạo class mới trong Header.css
              style={{ backgroundColor: '#ff4d4d' }} // Màu đỏ để phân biệt với nút đăng nhập
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          // Nếu CHƯA ĐĂNG NHẬP: Hiện nút Đăng nhập như cũ 
          <Link to="/login">
            <button className="btn-login">Đăng nhập</button>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;