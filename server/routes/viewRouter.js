const Router = require('express');
const router = new Router();
const viewController = require('../controllers/viewController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/project', authMiddleware, viewController.viewProject);
router.post('/news', authMiddleware, viewController.viewNews);

module.exports = router;
