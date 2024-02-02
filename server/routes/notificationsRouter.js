const Router = require('express');
const router = new Router();
const NotificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

router.patch('/', authMiddleware, NotificationController.viewNotification);
router.delete('/:id', authMiddleware, NotificationController.deleteNotification);
router.get('/', authMiddleware, NotificationController.getAll);

module.exports = router;
