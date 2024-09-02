const express = require('express');
const router = express.Router();
const { registerPeserta, getAllPeserta } = require('../controllers/pesertaController');
const Auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');
const upload = require('../middlewares/ufloaders');

router.post('/register', upload.single('suratPengantarMagang'), registerPeserta);
router.get('/',Auth, checkRole(['Admin']), getAllPeserta)
// router.get('/', getAllPeserta)

module.exports = router;
