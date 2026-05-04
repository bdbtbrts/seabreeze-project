import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import bcrypt from 'bcryptjs';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// API Đăng ký người dùng
app.post('/api/register', async (req, res) => {
  const { hoTen, email, matKhau, soDienThoai } = req.body;

  try {
    // 1. Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(matKhau, 10);

    // 2. Lưu vào database SQLite
    const user = await prisma.nGUOIDUNG.create({
      data: {
        HOTEN: hoTen,
        EMAIL: email,
        MATKHAU: hashedPassword,
        SODIENTHOAI: soDienThoai,
      },
    });

    res.status(201).json({ message: 'Đăng ký thành công rồi!', user });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Email đã tồn tại hoặc dữ liệu không hợp lệ!' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server bộ não đang chạy tại http://localhost:${PORT}`);
});

// API Đăng nhập
app.post('/api/login', async (req, res) => {
  const { email, matKhau } = req.body;

  try {
    // 1. Tìm người dùng theo Email
    const user = await prisma.nGUOIDUNG.findUnique({
      where: { EMAIL: email }
    });

    if (!user) {
      return res.status(404).json({ error: " Email này chưa đăng ký!" });
    }

    // 2. Kiểm tra mật khẩu (So sánh mật khẩu gõ vào với mật khẩu đã mã hóa)
    const isPasswordValid = await bcrypt.compare(matKhau, user.MATKHAU);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Mật khẩu sai rồi nhé!" });
    }

    // 3. Đăng nhập thành công
    res.status(200).json({ 
      message: "Đăng nhập thành công!", 
      user: { hoTen: user.HOTEN, email: user.EMAIL, vaiTro: user.VAITRO } 
    });

  } catch (error) {
    res.status(500).json({ error: "Lỗi hệ thống rồi: " + error.message });
  }
});


// API Cập nhật thông tin người dùng
app.put('/api/update-profile', async (req, res) => {
  const { email, soDienThoai } = req.body;

  try {
    const updatedUser = await prisma.nGUOIDUNG.update({
      where: { EMAIL: email },
      data: { SODIENTHOAI: soDienThoai },
    });

    res.status(200).json({ 
      message: "Cập nhật thành công!", 
      user: { 
        hoTen: updatedUser.HOTEN, 
        email: updatedUser.EMAIL, 
        soDienThoai: updatedUser.SODIENTHOAI 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: "Không thể cập nhật thông tin!" });
  }
});

// API Đổi mật khẩu
app.post('/api/change-password', async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    const user = await prisma.nGUOIDUNG.findUnique({ where: { EMAIL: email } });
    
    // Kiểm tra mật khẩu cũ có đúng không
    const isMatch = await bcrypt.compare(oldPassword, user.MATKHAU);
    if (!isMatch) return res.status(401).json({ error: "Mật khẩu cũ không chính xác!" });

    // Mã hóa mật khẩu mới và lưu lại
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.nGUOIDUNG.update({
      where: { EMAIL: email },
      data: { MATKHAU: hashedNewPassword },
    });

    res.status(200).json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi hệ thống!" });
  }
});

// API: Lấy danh sách đơn hàng của người dùng theo Email
app.get('/api/orders/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const orders = await prisma.dONHANG.findMany({
      where: {
        NGUOIDUNG: {
          EMAIL: email
        }
      },
      include: {
        CT_DONHANG: true // Lấy luôn chi tiết các món trong đơn hàng đó
      },
      orderBy: {
        NGAYDAT: 'desc' // Đơn mới nhất hiện lên đầu
      }
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi lấy lịch sử đơn hàng!" });
  }
});