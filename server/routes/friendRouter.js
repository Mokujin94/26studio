const Router = require("express");
const router = new Router();
const FriendController = require("../controllers/friendController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, FriendController.friendRequest);
router.patch("/", authMiddleware, FriendController.friendAccept);
router.delete("/", authMiddleware, FriendController.deleteFriend);
router.get("/friends", FriendController.getFriends);
router.get("/requests", authMiddleware, FriendController.getRequestFriends);

module.exports = router;
