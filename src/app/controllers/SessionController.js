const jwt = require('jsonwebtoken');
const Yup = require('yup');

const User = require('../models/User');
const configs = require('../../config/auth');

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'E-mail e senha obrigatórios.' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'E-mail não cadastrado.' });
    }

    if (!(await User.checkPassword(password, user))) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, configs.secret, {
        expiresIn: configs.expiresIn,
      }),
    });
  }
}

module.exports = new SessionController();
