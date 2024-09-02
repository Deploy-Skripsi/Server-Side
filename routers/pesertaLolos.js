const express = require('express');
const router = express.Router();
const { createPesertaLolos, editPesertaLolos, getAllPesertaLolos, deletePesertaLolos } = require('../controllers/pesertaLolosController');
const Auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');

router.post('/',Auth,checkRole(['Admin']), createPesertaLolos);
router.put('/edit/:id',Auth,checkRole(['Admin']), editPesertaLolos);
router.get('/', getAllPesertaLolos);
router.delete('/delete/:id',Auth,checkRole(['Admin']), deletePesertaLolos)

module.exports = router;
