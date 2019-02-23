/**
 * author: hppod
 * create: 22/02/2019 22h57
 * file: endereco_familiar.test.js
 */

const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
chai.use(chaiHttp)

const app = require('./../app')
const { EnderecoFamiliarModel } = require('./../app/models')
const { EnderecoModel } = require('./../app/models')
const { FamiliarModel } = require('./../app/models')

//INICIANDO MOCKS

const MOCK_ENDERECO_FAMILIAR_DEFAULT = {
    FAMILIAR_CODIGO: null,
    ENDERECO_CODIGO: null,
}

const MOCK_ENDERECO_FAMILIAR_CADASTRAR = {
    FAMILIAR_CODIGO: null,
    ENDERECO_CODIGO: null
}

const MOCK_ENDERECO_FAMILIAR_ERROR = {
    FAMILIAR_CODIGO: null
}

const MOCK_FAMILIAR_DEFAULT = {
    NOME: 'MARIA',
    SOBRENOME: 'DA GRAÇA',
    PARENTESCO: 'MÃE'
}

const MOCK_ENDERECO_DEFAULT = {
    ENDERECO: 'Rua Santo Antonio',
    NUMERO: '856',
    BAIRRO: 'Centro',
    COMPLEMENTO: 'Ap. 125',
    CIDADE: 'São Francisco do Brejão',
    ESTADO: 'MA',
    CEP: '65929970',
    REFERENCIA: 'Lanchonete do Paulão'
}

let MOCK_ENDERECO_FAMILIAR_FAMILIAR_CODIGO

//FINALIZANDO MOCKS

//TESTS

describe('Test Driven Development SALV-API Endereço Familiar', function () {
    this.beforeAll(async () => {
        const familiar = await FamiliarModel.create(MOCK_FAMILIAR_DEFAULT)
        const endereco = await EnderecoModel.create(MOCK_ENDERECO_DEFAULT)

        console.log('ADICIONANDO VALORES AO MOCK')
        MOCK_ENDERECO_FAMILIAR_DEFAULT.FAMILIAR_CODIGO = familiar.CODIGO
        MOCK_ENDERECO_FAMILIAR_DEFAULT.ENDERECO_CODIGO = endereco.CODIGO

        const result = await EnderecoFamiliarModel.create(MOCK_ENDERECO_FAMILIAR_DEFAULT)

        MOCK_ENDERECO_FAMILIAR_FAMILIAR_CODIGO = result.FAMILIAR_CODIGO

        console.log('FAMILIAR' + MOCK_ENDERECO_FAMILIAR_FAMILIAR_CODIGO)
    })

    //GET ID
    describe('/GET/ID: ', () => {
        it('Deve retornar o endereço de um familiar dado o ID dele', (done) => {
            chai.request(app)
            .get(`/endereco_familiar/${MOCK_ENDERECO_FAMILIAR_FAMILIAR_CODIGO}`)
            .end((error, res) => {
                const result = res.body
                expect(res.stautsCode).to.eql(200)
                expect(result).to.eql(MOCK_ENDERECO_FAMILIAR_DEFAULT)
                done()
            })
        })
    })

    
})