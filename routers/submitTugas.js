const express = require('express');
const router = express.Router();
const { createSubmitTugas, getAllTugas } = require('../controllers/submitTugasController');
const Auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');
const upload = require('../middlewares/ufloaders');

router.post('/submit',Auth,checkRole(['User']), upload.single('fileTugas'), createSubmitTugas);
router.get('/',Auth,checkRole(['Admin']),getAllTugas);

module.exports = router;
