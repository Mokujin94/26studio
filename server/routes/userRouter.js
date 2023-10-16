const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/registration", userController.registration);
router.post("/registration/condidate", userController.checkCondidate);
router.post("/login", userController.login);
router.get("/auth", authMiddleware, userController.check);
router.get("/:id/friends", userController.getFriends);

module.exports = router;
