const Router = require('express');
const router = new Router();
const DraftController = require('../controllers/draftController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:id', authMiddleware, DraftController.getAll);
router.post('/', authMiddleware, DraftController.update);

module.exports = router;
