const Router = require('express');
const router = new Router();
const NotificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, NotificationController.getAll);
router.patch('/', authMiddleware, NotificationController.viewNotification);

module.exports = router;
