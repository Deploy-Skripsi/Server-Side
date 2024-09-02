const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY } = process.env;

// Register New User by admin
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Cek apakah pengguna sudah ada
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Buat objek pengguna baru
    user = new User({
      name,
      email,
      password,
      role,
    });

    // Enkripsi password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Simpan pengguna ke database
    await user.save();

    res.json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
// Login user
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Cari pengguna berdasarkan email
    let user = await User.findOne({ email });

    // Jika pengguna tidak ditemukan
    if (!user) {
      return res.status(400).json({
        msg: 'Invalid Email or Password' });
    }

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        msg: 'Invalid credentials' });
    }

    // //Generate JWT dan waktu expired di sisi client
    
    // let token = jwt.sign({_id: user._id}, JWT_SECRET_KEY,{ expiresIn: '1h' });

   
      // Payload yang mencakup _id dan role
      const payload = {
          _id: user._id,
          role: user.role // Menambahkan role ke dalam payload
      };
  
      // Membuat token dengan payload dan waktu kedaluwarsa
      const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' });
  

    // Set session
    req.session.userId = user._id; // Sesuaikan dengan ID user dari MongoDB
    req.session.role = user.role; // Simpan juga role jika diperlukan
    // req.session.createdAt = Date.now(); // Simpan waktu session dibuat

    return res.status(200).json({
      status: true,
      message: "Login successful",
      data: {
        user: {
          email: user.email,
          role: user.role
        },
        token,
        sessionId: req.session.id
      },
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
// Edit User by user
const editUser = async (req, res) => {
  const { _id } = req.params; // Dapatkan ID pengguna dari parameter URL
  const { name, email, password } = req.body; // Dapatkan data yang diubah dari body request

  try {
    // Buat objek update
    let updateData = { name, email };

    // Jika password disediakan, enkripsi dan tambahkan ke objek update
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Cari pengguna berdasarkan ID dan update data yang diberikan
    const user = await User.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true } // Pilihan untuk mengembalikan dokumen yang diperbarui dan menjalankan validasi
    );

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({
      msg: 'User updated successfully',
      data: user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
// Get all user for admin only
const getAllUser = async (req,res)=>{
  try {
    // Mengambil semua pengguna dari database
    const users = await User.find().select('-password'); // Menghindari mengirimkan password ke client

    // Mengirimkan pengguna sebagai respons
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// Find user by id
const findUserById = async (req, res) => {
  const { _id } = req.params; // Dapatkan ID pengguna dari parameter URL

  try {
    // Cari pengguna berdasarkan ID
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({
      msg: 'User found',
      data: user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
// const logoutUser = async (req,res)=>{
//   try {
//     // Hapus session dari server
//     req.session.destroy((err) => {
//       if (err) {
//         console.error('Failed to destroy session:', err);
//         return res.status(500).json({ msg: 'Failed to logout' });
//       }
//       // Hapus cookie sesi dari client
//       res.clearCookie('connect.sid'); // Sesuaikan nama cookie jika berbeda
//       res.json({ msg: 'Logout berhasil' });
//     });
//   } catch (err) {
//     console.error('Error during logout:', err.message);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };
const logoutUser = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error('Failed to destroy session:', err);
        return res.status(500).json({ msg: 'Failed to logout' });
      }
      console.log('Session destroyed');
      res.clearCookie('connect.sid');
      console.log('Cookie cleared');
      res.json({ msg: 'Logout berhasil' });
    });
  } catch (err) {
    console.error('Error during logout:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete user by Id
const deleteUserById = async (req, res) => {
  const { _id } = req.params; // Dapatkan ID pengguna dari parameter URL

  try {
    // Cari pengguna berdasarkan ID
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Cek apakah pengguna yang ingin dihapus adalah admin
    if (user.role === 'Admin') {
      return res.status(403).json({ msg: 'Cannot delete an Admin user' });
    }

    // Hapus pengguna
    await User.findByIdAndDelete(_id);

    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  registerUser,
  loginUser,
  editUser,
  findUserById,
  logoutUser,
  getAllUser,
  deleteUserById
};
