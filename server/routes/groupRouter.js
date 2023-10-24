const Router = require("express");
const router = new Router();
const GroupController = require("../controllers/groupController");

router.post("/", GroupController.create);
router.get("/", GroupController.getAll);
router.get("/:id", GroupController.getOne);
router.patch("/:id/add", GroupController.addMember);

module.exports = router;
