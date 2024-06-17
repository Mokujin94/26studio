const Router = require("express");
const router = new Router();
const linkController = require("../controllers/linkController");


router.get('/preview', linkController.getPreview);
module.exports = router;
