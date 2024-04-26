const Router = require("express");
const router = new Router();
const chatController = require("../controllers/chatController");


router.post("/:id", chatController.createMessage);
router.get("/:id", chatController.getOne);
router.get("/messages/:id", chatController.getMessages);

module.exports = router;
