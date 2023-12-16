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
router.get('/users/me', usersController.getMe);
module.exports = router;
