const User = require('../models/Users');

class UserController {
    async store(req, res) {

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

        await User.update(req.body, { returning: true, where: { id: userId } })
                .then((updatedUser) => {
                    res.json(updatedUser);
                });
            
        //console.log(userAlterado);
        // let obj = {
        //     id,
        //     name,
        //     email,
        //     provider
        // }

    }
}

module.exports = new UserController();
