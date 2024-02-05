const Router = require("express");
const router = new Router();
const FriendController = require("../controllers/friendController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", FriendController.reqFriend);
router.patch("/", authMiddleware, FriendController.addFriend);
router.get("/", FriendController.getFriends);
router.get("/request", FriendController.getFriendsRequest);
router.delete("/", authMiddleware, FriendController.deleteFriend);

module.exports = router;
