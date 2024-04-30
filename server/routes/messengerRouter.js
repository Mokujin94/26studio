const Router = require("express");
const router = new Router();
const messengerController = require("../controllers/messengerController");
const authMiddleware = require('../middleware/authMiddleware');


router.post('/', authMiddleware, messengerController.getOnePersonal);
router.get('/chats', authMiddleware, messengerController.getAllChats);
// router.get('/group/:id', chatController.getOneGroup);

module.exports = router;
