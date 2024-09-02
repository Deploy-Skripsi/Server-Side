const express = require('express');
const router = express.Router();
const { createSertifikat,getAllSertifikat } = require('../controllers/sertifikatController');
const Auth = require('../middlewares/authMiddleware');
const checkSession = require('../middlewares/checkSession');
const checkRole = require('../middlewares/checkRole');
const cekRole = require('../middlewares/cekRole');

router.get('/all', checkSession, Auth, checkRole(['Admin']), getAllSertifikat);

router.post('/create', checkSession, Auth, checkRole(['User']), createSertifikat);
// router.post('/',Auth,checkRole(['User']), createSertifikat)

module.exports = router;
