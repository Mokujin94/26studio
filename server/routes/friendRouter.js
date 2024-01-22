const Router = require('express');
const router = new Router();
const FriendController = require('../controllers/friendController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, FriendController.addFriend);
router.post('/subscriber', authMiddleware, FriendController.addSubscriber);
router.get('/', FriendController.getAllFriends);
router.get('/subscriber',  FriendController.getAllSubscriber);
router.delete('/', authMiddleware, FriendController.deleteFriend);
router.delete('/subscriber', authMiddleware, FriendController.deleteSubscriber);

module.exports = router;
