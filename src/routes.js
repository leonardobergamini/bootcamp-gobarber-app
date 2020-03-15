const { Router } = require('express');
const multer = require('multer');
const multerConfigs = require('./config/multer');

const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');
const FileController = require('./app/controllers/FileController');
const ProviderController = require('./app/controllers/ProviderController');
const AppointmentController = require('./app/controllers/AppointmentController');
const ScheduleController = require('./app/controllers/ScheduleController');
const NotificationController = require('./app/controllers/NotificationController');

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
routes.get('/appointments', authMiddleware, AppointmentController.index);
routes.delete(
  '/appointments/:id',
  authMiddleware,
  AppointmentController.delete
);

/**
 * Rotas para listagem de agendamentos para os provedores de serviços
 */
routes.get('/schedules', authMiddleware, ScheduleController.index);

/**
 * Rotas das notificações para os providers
 */
routes.get('/notifications', authMiddleware, NotificationController.index);
routes.put('/notifications/:id', authMiddleware, NotificationController.update);

module.exports = routes;
