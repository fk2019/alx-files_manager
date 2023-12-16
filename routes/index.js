const express = require('express');

const router = express.Router();

const appController = require('../controllers/AppController');

const usersController = require('../controllers/UsersController');

const authController = require('../controllers/AuthController');

router.get('/status', appController.getStatus);
router.get('/stats', appController.getStats);
router.post('/users', express.json(), usersController.postNew);
router.get('/connect', authController.getConnect);
router.get('/disconnect', authController.getDisconnect);
<<<<<<< HEAD
router.get('/users/me', usersController.getMe);
=======
router.post('/users/me', usersController.getMe);
>>>>>>> 2e11de8a4b194797b77ae70017dab82b10621bcb
module.exports = router;
