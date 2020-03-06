const { Router } = require('express');
const multer = require('multer');
const multerConfigs = require('./config/multer');

const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');
const FileController = require('./app/controllers/FileController');
const ProviderController = require('./app/controllers/ProviderController');
const AppointmentController = require('./app/controllers/AppointmentController');

const authMiddleware = require('./app/middlewares/auth');

const routes = new Router();
const upload = multer(multerConfigs);

/**
 * Rotas de User
 */
routes.post('/users', UserController.store);
routes.get('/users', UserController.index);
routes.put('/users', authMiddleware, UserController.update);
routes.get('/providers', authMiddleware, ProviderController.index);

/**
 * Rotas para sessão do usuário
 */
routes.post('/session', SessionController.store);

/**
 * Rotas para envio de arquivos
 */
routes.post(
  '/file',
  authMiddleware,
  upload.single('file'),
  FileController.store
);

/**
 * Rotas para agendamento
 */
routes.post('/appointments', authMiddleware, AppointmentController.store);

module.exports = routes;
