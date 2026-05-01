const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// API Đăng ký người dùng
app.post('/api/register', async (req, res) => {
  const { hoTen, email, matKhau, soDienThoai } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(matKhau, 10);
    const user = await prisma.nGUOIDUNG.create({
      data: {
        HOTEN: hoTen,
        EMAIL: email,
        MATKHAU: hashedPassword,
        SODIENTHOAI: soDienThoai,
      },
    });
    res.status(201).json({ message: 'Thịnh ơi, đăng ký thành công rồi!', user });
  } catch (error) {
    res.status(400).json({ error: 'Lỗi: Email có thể đã tồn tại!' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});