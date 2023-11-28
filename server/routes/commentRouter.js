const Router = require("express");
const router = new Router();
const CommentController = require("../controllers/commentController");

router.post("/project", CommentController.createCommentProject);
router.post("/news", CommentController.createCommentNews);
router.get("/project/:id", CommentController.getAllCommentsProject);
router.get("/news/:id", CommentController.getAllCommentsNews);

module.exports = router;
