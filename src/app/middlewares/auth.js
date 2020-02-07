const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');

module.exports =  async function (req, res, next) {
    const authToken = req.headers.authorization;

    if(!authToken) {
        return res.status(401).json( { error: 'Token obrigatório' } )
    }

    const [, token] = authToken.split(' ');

    try {
        const responseTokenValidation = await jwt.verify(token, authConfig.secret);
        req.userId = responseTokenValidation.id;
        return next();
    } catch(err) {
        return res.status(401).json( { error: 'Token de autenticação não identificado' } );
    }
}