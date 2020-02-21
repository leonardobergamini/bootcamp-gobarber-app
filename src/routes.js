const { Router } = require('express');
const multer = require('multer');

const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');
const authMiddleware = require('./app/middlewares/auth');

const multerConfigs = require('./config/multer');

const routes = new Router();
const upload = multer(multerConfigs);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);
routes.get('/users', UserController.index);
routes.put('/users', authMiddleware, UserController.update);
routes.post('/file', upload.single('file'), (req, res) => {
    return res.json({ ok: true });
});


module.exports = routes;