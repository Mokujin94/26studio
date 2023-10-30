const Router = require("express");
const router = new Router();
const FriendController = require("../controllers/friendController");

router.post("/", FriendController.addFriend);
router.get("/", FriendController.getAll);


module.exports = router;