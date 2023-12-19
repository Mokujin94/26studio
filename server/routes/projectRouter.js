const Router = require("express");
const router = new Router();
const ProjectController = require("../controllers/projectController");

router.post("/like", ProjectController.setLike);
router.delete("/delete", ProjectController.deleteLike);
router.get("/condidate", ProjectController.condidateLike);
router.get("/user/:id", ProjectController.getAllUser);
router.get("/", ProjectController.getAll);
router.get("/:id", ProjectController.getOne);

module.exports = router;
