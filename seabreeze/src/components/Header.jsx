import './Header.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCartShopping } from 'react-icons/fa6';

function Header() {
  const [user, setUser] = useState(null);

  // Kiểm tra trạng thái đăng nhập khi Header load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    alert("Đã đăng xuất thành công!");
    window.location.href = '/login';
  };

  return (
    <header className="mainHeader">
      {/* 1. Logo SeaBreeze */}
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

      {/* 2. Menu Điều hướng */}
      <nav className="nav-menu">
        <Link to="/" className="nav-item">Trang chủ</Link>
        <a href="#homestay-section" className="nav-item">Homestay</a>
        <a href="#rent-section" className="nav-item">Thuê đồ</a>
        <a href="#contact-footer" className="nav-item">Liên hệ</a>
      </nav>

      {/* 3. Khu vực hành động người dùng */}
      <div className="user-actions">
        <div className="cart-icon">
          <FaCartShopping />
          <span className="cart-count">0</span>
        </div>

        {user ? (
          // --- TRẠNG THÁI: ĐÃ ĐĂNG NHẬP ---
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Link to="/history" style={{ textDecoration: 'none', color: '#666', fontSize: '14px' }}>
              Lịch sử
            </Link>
            
            <Link to="/profile" style={{ textDecoration: 'none', color: '#333', fontWeight: '500' }}>
              Chào, {user.hoTen}
            </Link>

            <button 
              onClick={handleLogout} 
              className="btn-login" 
              style={{ backgroundColor: '#ff4d4d' }} // Màu đỏ đăng xuất
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          // --- TRẠNG THÁI: CHƯA ĐĂNG NHẬP ---
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/login">
              <button className="btn-login">Đăng nhập</button>
            </Link>
            
            {/* Nút Đăng ký đã được đổi sang màu đỏ theo ý Thịnh */}
            <Link to="/register">
              <button 
                className="btn-login" 
                style={{ backgroundColor: '#ff4d4d' }} 
              >
                Đăng ký
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;