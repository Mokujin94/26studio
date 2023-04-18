const Router = require('express')
const router = new Router()
const NewsController = require('../controllers/newsController')
const checkRole = require('../middleware/checkRoleMiddleware')


router.post('/', checkRole(4), NewsController.create)
router.get('/', NewsController.getAll) 
router.get('/:id', NewsController.getOne)

module.exports = router