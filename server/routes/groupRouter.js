const Router = require("express");
const router = new Router();
const GroupController = require("../controllers/groupController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.post("/", GroupController.create);
router.get("/", GroupController.getAll);
router.get("/:id", GroupController.getOne);
router.patch("/add", checkRoleMiddleware([2, 3]), GroupController.addMember);
router.patch(
	"/:id/delete",
	checkRoleMiddleware([2, 3]),
	GroupController.deleteMember
);

module.exports = router;
