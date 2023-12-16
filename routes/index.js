const express = require('express');

const router = express.Router();

const appController = require('../controllers/AppController');

const usersController = require('../controllers/UsersController');

router.get('/status', appController.getStatus);
router.get('/stats', appController.getStats);
router.post('/users', express.json(), usersController.postNew);
module.exports = router;
