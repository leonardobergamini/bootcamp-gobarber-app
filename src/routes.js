const { Router } = require('express');
const User = require('./app/models/Users');

const routes = new Router();

routes.get('/', async (req, res) => {
    const usuario = await User.create({
        name: "Leonardo Bergamini",
        email: "leonardo@leonardo.com.br",
        password_hash: "leonardo"
    });
    return res.json(usuario);
})

module.exports = routes;