const { Router } = require('express');
const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');
const authMiddleware = require('./app/middlewares/auth');

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);
routes.get('/users', UserController.index);
routes.put('/users', authMiddleware, UserController.update);


module.exports = routes;