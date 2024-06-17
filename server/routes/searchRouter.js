const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');
const searchController = require('../controllers/searchController');

router.get('/', searchController.searching);

module.exports = router;
