const Router = require("express");
const router = new Router();
const rolesController = require("../controllers/rolesController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.post("/", rolesController.create);

module.exports = router;
