var express = require('express');
var router = express.Router();
const messagesController = require('../controllers/messagesController');

router.get('/create', messagesController.getCreate);
router.post('/create', messagesController.postCreate);
router.post('/delete', messagesController.postDelete);

module.exports = router;