const Router = require("express");
const router = new Router();
const chatController = require("../controllers/chatController");


router.get("/:id", chatController.getOne);

module.exports = router;
