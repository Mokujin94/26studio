const Router = require("express");
const router = new Router();
const FriendController = require("../controllers/friendController");
const authMiddleware = require("../middleware/authMiddleware");


router.post('/',  FriendController.friendRequest);
router.patch('/',  FriendController.friendAccept);
router.delete('/',  FriendController.deleteFriend);
router.get('/friends', FriendController.getFriends);
router.get('/requests',  FriendController.getRequestFriends);

module.exports = router;
