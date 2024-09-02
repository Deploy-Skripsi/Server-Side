const imagekit = require('../lib/imagekitConfig');
const SubmitTugas = require('../models/submitTugas');
const httpStatus = require('http-status');
const path = require('path');

//Create new submit tugas
const createSubmitTugas = async (req, res) => {
    const { fullName, email, keterangan } = req.body;
    const fileTugas = req.file;
  
    try {
        //upload file tugas ke imagekit
        let fileUrl = '';
        if (fileTugas) {
          const result = await imagekit.upload({
            file: fileTugas.buffer, // Buffer file
            fileName: `${Date.now()}${path.extname(fileTugas.originalname)}`, // Nama file
            folder: 'tugas_peserta' // Nama folder di ImageKit
          });
          fileUrl = result.url;
        }
      // Create new submission
      const newSubmitTugas = new SubmitTugas({
        fullName,
        email,
        keterangan,
        fileTugas :fileUrl,
      });
  
      // Save submission to database
      await newSubmitTugas.save();
  
      res.status(httpStatus.CREATED).json({ message: 'Submission created successfully', submitTugas: newSubmitTugas });
    } catch (error) {
      console.error(error.message);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
    }
  };
//get all tugas yang sudah disubmit
const getAllTugas = async (req, res) => {
    try {
      // Mengambil semua tugas dari database
      const tugasList = await SubmitTugas.find();
      
      // Mengirim respons dengan status 200 dan data tugas
      res.status(httpStatus.OK).json(tugasList);
    } catch (error) {
      console.error(error.message);
      // Mengirim respons dengan status 500 jika terjadi kesalahan
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
    }
  };

module.exports = {
    createSubmitTugas,
    getAllTugas
}