const Router = require("express");
const router = new Router();
const ProjectController = require("../controllers/projectController");

router.post("/", ProjectController.create);
router.get("/", ProjectController.getAll);
router.get("/:id", ProjectController.getOne);

module.exports = router;
