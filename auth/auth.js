const sequelize = require('./../database/sequelize_remote')
const DataTypes = sequelize.DataTypes
const UsuarioModel = require('./../app/models/usuario')(sequelize, DataTypes)
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const apiConfig = require('./api-config')

const handleAuthentication = (req, res) => {
    const mailUser = req.body.email
    const senha = req.body.senha

    UsuarioModel.findOne({
        where: {
            EMAIL: mailUser
        }
    })
        .then((login) => {
            if (!login) {
                res.status(403).json({ message: "Dados Inválidos" })
            }

            console.log(`EMAIL: ${mailUser}, SENHA: ${senha}, LOG: ${login.LOGIN}`)
            bcrypt.compare(senha, login.SENHA, function (err, result) {
                if (result) {
                    const token = jwt.sign({
                        sub: mailUser,
                        iss: "salv-api"
                    }, apiConfig.secret)
                    res.status(200).json({ login: login.LOGIN, accessToken: token })
                } else {
                    res.status(403).json({ message: "Não autenticado. Verifique seus dados" })
                }
            })
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ err: err })
        })
}

module.exports = handleAuthentication