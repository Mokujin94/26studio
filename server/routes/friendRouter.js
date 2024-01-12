const Router = require('express');
const router = new Router();
const FriendController = require('../controllers/friendController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, FriendController.addFriend);
router.get('/', FriendController.getAll);

module.exports = router;
