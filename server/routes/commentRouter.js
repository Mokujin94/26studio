const Router = require('express');
const router = new Router();
const CommentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/project', authMiddleware, CommentController.createCommentProject);
router.post('/news', authMiddleware, CommentController.createCommentNews);
router.get('/project/:id', CommentController.getAllCommentsProject);
router.get('/news/:id', CommentController.getAllCommentsNews);

module.exports = router;
