const express = require('express');
const router = express.Router();
const { registerUser,loginUser,editUser, getAllUser, findUserById, logoutUser,deleteUserById } = require('../controllers/userController');
const Auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');

// router.get('/',Auth, checkRole(['Admin']), getAllUser );
router.get('/', getAllUser );
router.get('/:_id',findUserById);
// router.post('/register',Auth, checkRole(['Admin']), registerUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/edit/:_id', Auth, checkRole(['User']), editUser);
router.post('/logout',logoutUser);
router.delete('/:_id', Auth,checkRole(['Admin']),deleteUserById)

module.exports = router;
