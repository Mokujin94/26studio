const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registration', userController.registration);
router.post('/registration/condidate', userController.checkCondidate);
router.post('/login', userController.login);
router.get('/login/recovery', userController.getUserByEmail);
router.patch('/login/recovery', userController.recoveryPassword);
router.post('/code', userController.generateCode);

router.get('/auth', authMiddleware, userController.check);
router.post('/upload_project', authMiddleware, userController.uploadProject);
router.post('/upload_finished_project', authMiddleware, userController.uploadFinishedProject);
router.get('/accept_project', userController.sendProjectViewer);
router.get('/all', userController.getAll);
router.get('/tutors', userController.getAllTutors);
router.get('/group_manage', userController.getUsersByGroupStatus);
router.get('/search/groups', userController.searchUsersByName);
router.get('/:id', userController.getProfileUser);
router.get('/', userController.getOneUser);
router.patch('/avatar', authMiddleware, userController.updateAvatar);
router.patch('/update/:id', authMiddleware, userController.update);
router.patch('/:id', userController.checkOnline)

module.exports = router;
