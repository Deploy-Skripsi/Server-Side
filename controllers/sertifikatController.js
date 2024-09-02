const Sertifikat = require('../models/sertifikat'); // Sesuaikan dengan path model Anda

// Controller untuk membuat Sertifikat
const createSertifikat = async (req, res) => {
  const { fullName, instansi } = req.body;

  try {
    // Buat objek Sertifikat baru
    const sertifikat = new Sertifikat({
      fullName,
      instansi,

    });

    // Simpan Sertifikat ke database
    await sertifikat.save();

    res.status(201).json({ msg: 'Sertifikat created successfully', sertifikat });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Controller untuk mendapatkan semua Sertifikat
const getAllSertifikat = async (req, res) => {
  try {
    const sertifikats = await Sertifikat.find(); // Mengambil semua Sertifikat dari database

    if (!sertifikats.length) {
      return res.status(404).json({ msg: 'No Sertifikat found' });
    }

    res.status(200).json(sertifikats);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  createSertifikat,
  getAllSertifikat,
};
