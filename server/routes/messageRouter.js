const Router = require("express");
const router = new Router();
const newsController = require("../controllers/newsController");

router.post("/registration");
router.post("/login");
router.get("/auth");

module.exports = router;
