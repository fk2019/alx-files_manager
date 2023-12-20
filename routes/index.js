const express = require('express');

const router = express.Router();

const appController = require('../controllers/AppController');

const usersController = require('../controllers/UsersController');

const authController = require('../controllers/AuthController');

const filesController = require('../controllers/FilesController');

router.get('/status', appController.getStatus);
router.get('/stats', appController.getStats);
router.post('/users', express.json(), usersController.postNew);
router.get('/connect', authController.getConnect);
router.get('/disconnect', authController.getDisconnect);
router.get('/users/me', usersController.getMe);
router.post('/files', express.json({ limit: '50mb' }), filesController.postUpload);
router.get('/files/:id', filesController.getShow);
router.get('/files', filesController.getIndex);
router.put('/files/:id/publish', filesController.putPublish);
router.put('/files/:id/unpublish', filesController.putUnpublish);
router.get('/files/:id/data', filesController.getFile);
module.exports = router;
