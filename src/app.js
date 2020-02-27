const express = require('express');
const path = require('path');

const routes = require('./routes');
const database = require('./database');
class App {
    constructor() {
        this.server = express();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(express.json());
        this.server.use(
            '/file',
            express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
            );
    }

    routes() {
        this.server.use(routes);
    }
}

module.exports = new App().server;