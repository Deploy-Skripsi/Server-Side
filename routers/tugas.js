const express = require('express');
const router = express.Router();
const {
  createTugas,updateTugas,deleteTugas,
  getAllTugas
} = require('../controllers/tugasController');
const Auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');
const upload = require('../middlewares/ufloaders');

// Route untuk membuat tugas baru
router.post('/create',Auth, checkRole(['Admin']), upload.single('file'), createTugas);
router.put('/edit/:_id',Auth, checkRole(['Admin']), upload.single('file'), updateTugas);
router.delete('/:_id',Auth, checkRole(['Admin']), upload.single('file'), deleteTugas);
// Route untuk mendapatkan semua tugas
router.get('/', Auth, checkRole(['User', 'Admin']), getAllTugas);

// // Route untuk mendapatkan tugas berdasarkan ID
// router.get('/:tugasId',Auth, checkRole(['User', 'Admin']), getTugasById);
// // Route untuk memperbarui tugas berdasarkan ID
// router.put('/:id', Auth, checkRole(['Admin']), upload.single('file'), updateTugas);
// // Route untuk menghapus tugas berdasarkan ID
// router.delete('/:id',Auth, checkRole(['Admin']), deleteTugas);

module.exports = router;
