/**
 * @author Ian Rotondo Bagliotti
 * @email ian.bagliotti@gmail.com
 * @create date 2019-02-19 11:46:19
 * @modify date 2019-02-20 11:31:36
 * @desc Arquivo de Rotas da API Beneficio
 */

 
const express = require('express')
const route = express.Router()

const BeneficioController = require('./../controllers/beneficio')

route.get('/beneficio', BeneficioController.get)
route.get('/beneficio/:name', BeneficioController.getByName)
route.post('/beneficio', BeneficioController.create)
route.put('/beneficio/:name', BeneficioController.update)
route.delete('/beneficio/:name', BeneficioController.delete)

module.exports = route