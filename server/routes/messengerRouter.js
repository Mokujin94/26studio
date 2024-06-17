const Router = require("express");
const router = new Router();
const messengerController = require("../controllers/messengerController");
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', messengerController.getOnePersonal);
router.get('/chats', authMiddleware, messengerController.getAllChats);
router.get('/getMessages', messengerController.getMessages);
router.post('/sendMessage', messengerController.createMessages);
router.post('/readMessage', messengerController.readMessage);
// router.get('/group/:id', chatController.getOneGroup);

module.exports = router;
