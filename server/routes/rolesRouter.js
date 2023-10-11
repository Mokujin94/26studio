const Router = require("express");
const router = new Router();
const rolesController = require("../controllers/rolesController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", rolesController.create);

module.exports = router;
