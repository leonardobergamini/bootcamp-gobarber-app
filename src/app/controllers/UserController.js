const Yup = require('yup');

const User = require('../models/User');

class UserController {
    async store(req, res) {

        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            name: Yup.string().required(),
            password: Yup.string().min(6).required(),
        });

        if(!(await schema.isValid(req.body))) {
            return res.status(400).json( { error: 'Erro na validação.' } );
        }

        const userExists = await User.findOne( { where : { email: req.body.email } } );

        if(userExists) {
            return res.status(400).json( { error: 'Usuário já existe' } );
        }

        const { id, name, email, provider } = await User.create(req.body);
        return res.json({
            id,
            name,
            email,
            provider
        });
    }

    async index(req, res) {
        const users = await User.findAll();

        return res.json(users);
    }

    async update(req, res) {
        const userId = req.userId;

        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string().min(6).when('oldPassword', (oldPassword, field) => 
                oldPassword ? field.required() : field
            ),
            confirmPassword: Yup.string().when('password', (password, field) =>
                // oneOf(): copia o campo (referência)
                password ? field.required().oneOf([Yup.ref('password')]) : field    
            )
        })

        if(!(await schema.isValid(req.body))) {
            return res.status(400).json( { error: 'Erro na validação.' } );
        }

        // Verificar se o usuário passou um novo email e
        // se ele é diferente do cadastrado

        const user = await User.findByPk(userId);
        const { email, oldPassword } = req.body;
        
        
        if(email && email !== user.email) {
            const userByEmail = await User.findOne( { where: { email: email } } );

            if(userByEmail) {
                return res.status(400).json( { error: 'Usuário já existe' } )
            }
        }

        // Verificar se o usuário passou uma senha antiga e se
        // ela confere com a cadastrada no banco

        if(oldPassword && !(await User.checkPassword(oldPassword, user))) {
            return res.status(400).json( { error: 'Senha não confere' } )
        }

        // Caso passe pelas validações, alterar os dados do usuário

        const { name, provider } = await user.update(req.body);
            
        let obj = {
            id: userId,
            name,
            email,
            provider
        }

        return res.json(obj);

    }
}

module.exports = new UserController();
