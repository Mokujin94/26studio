const Router = require("express");
const router = new Router();
const messengerController = require("../controllers/messengerController");
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', messengerController.getOnePersonal);
router.get('/chats', authMiddleware, messengerController.getAllChats);
router.post('/sendMessage', messengerController.createMessages);
// router.get('/group/:id', chatController.getOneGroup);

module.exports = router;
