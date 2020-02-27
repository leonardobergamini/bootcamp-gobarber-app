const { Router } = require('express');
const multer = require('multer');
const multerConfigs = require('./config/multer');

const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');
const FileController = require('./app/controllers/FileController');
const ProviderController = require('./app/controllers/ProviderController');

const authMiddleware = require('./app/middlewares/auth');

const routes = new Router();
const upload = multer(multerConfigs);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);
routes.get('/users', UserController.index);
routes.get('/providers', ProviderController.index);
routes.put('/users', authMiddleware, UserController.update);
routes.post('/file', upload.single('file'), FileController.store);


module.exports = routes;