const Router = require("express");
const router = new Router();
const ProjectController = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/like", authMiddleware, ProjectController.setLike);
router.patch("/like", authMiddleware, ProjectController.deleteLike);
router.get("/condidate", ProjectController.condidateLike);
router.get("/search", ProjectController.searchProject);
router.get("/user/:id", ProjectController.getAllUser);
router.get("/", ProjectController.getAll);
router.get("/:id", ProjectController.getOne);
router.delete("/:id", authMiddleware, ProjectController.deleteOne)

module.exports = router;
