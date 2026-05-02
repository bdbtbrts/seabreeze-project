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