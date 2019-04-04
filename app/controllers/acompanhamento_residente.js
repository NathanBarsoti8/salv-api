const sequelize = require('./../../database/sequelize_remote')
const { AcompanhamentoResidenteModel } = require('./../models')

class AcompanhamentoResidente {

    getById(req, res) {
        sequelize.query(`SELECT
                            A.CODIGO,
                            P.NOME, P.SOBRENOME,
                            R.APELIDO
                        FROM
                            ACOMPANHAMENTO A
                            LEFT JOIN ACOMPANHAMENTO_RESIDENTE AR
                            ON AR.ACOMPANHAMENTO_CODIGO = A.CODIGO
                            LEFT JOIN RESIDENTE R
                            ON R.CODIGO_RESIDENTE = AR.RESIDENTE_CODIGO
                            LEFT JOIN PESSOA P
                            ON P.CODIGO = R.PESSOA_CODIGO
                            WHERE A.CODIGO = ACOMPANHAMENTO_CODIGO`,
            { replacements: { ACOMPANHAMENTO_CODIGO: req.params.id } })
            .then(result => {
                res.json(result[0])
            })
    }
    create(req, res) {
        let count = 0;
        req.body.forEach(element => {
            AcompanhamentoResidenteModel.create(element)
                .then()
                .catch(error => res.json(error))
            count++
        })
        res.json({ message: `Foram adicionados ${count} Acompanhamentos Residentes` })
    }
    delete(req, res) {
        AcompanhamentoResidenteModel.destroy({ where: { RESIDENTE_CODIGO: req.params.id } })
            .then(acompanhamento_residente => res.json(acompanhamento_residente))
            .catch(error => res.json(error))
    }


}
module.exports = new AcompanhamentoResidente()