var express = require('express');
var router = express.Router();
const usersController = require('../controllers/usersController');

/* GET users listing. */
router.get('/signup', usersController.getSignup);
router.post('/signup', usersController.postSignup);

router.get('/login', usersController.getLogin);
router.post('/login', usersController.postLogin);
router.get('/logout', usersController.getLogout);

router.get('/member', usersController.getMember);
router.post('/member', usersController.postMember);

module.exports = router;
