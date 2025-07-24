const Router = require('express');
const router = new Router();
const NewsController = require('../controllers/newsController');
const checkRole = require('../middleware/checkRoleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, NewsController.create);
router.post('/like', authMiddleware, NewsController.setLike);
router.post('/upload_photo', authMiddleware, NewsController.uploadPhoto);
router.delete('/delete', authMiddleware, NewsController.deleteLike);
router.get('/condidate', NewsController.condidateLike);
router.get('/', NewsController.getAll);
router.get('/proposed', NewsController.getAllProposed);
router.get('/:id', NewsController.getOne);

module.exports = router;
