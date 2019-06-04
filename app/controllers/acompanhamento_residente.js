const sequelize = require('./../../database/sequelize_remote')
const { AcompanhamentoResidenteModel, AcompanhamentosModel, ResidenteModel } = require('./../models')

AcompanhamentoResidenteModel.belongsTo(ResidenteModel, { as: 'RESIDENTE', foreignKey: 'CODIGO_RESIDENTE' })
AcompanhamentoResidenteModel.belongsTo(AcompanhamentosModel, { as: 'ACOMPANHAMENTO', foreignKey: 'ACOMPANHAMENTO_CODIGO' })
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
                            ON R.CODIGO_RESIDENTE = AR.CODIGO_RESIDENTE
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
        req.body.forEach((element, index, array) => {
            AcompanhamentoResidenteModel.create(element)
                .then(() => {
                    count++
                    if (count == array.length)
                        res.json({ message: `Foram adicionados ${count} Acompanhamentos Residentes` })
                })
                .catch(error => res.json(error))
        })
    }


    delete(req, res) {
        let idRe = req.params.idResidente
        let idAc = req.params.idAcompanhamento
        let deleteAc = 'DELETE FROM ACOMPANHAMENTO_RESIDENTE WHERE CODIGO_RESIDENTE = "' + idRe + '"  AND ACOMPANHAMENTO_CODIGO = "' + idAc + '" '

        sequelize.query(deleteAc)
            .then(result => {
                res.json(result[0])
            })
    }

    deleteAll(req, res) {

        let idAc = req.params.idAcompanhamento
        let deleteAc = 'DELETE FROM ACOMPANHAMENTO_RESIDENTE WHERE ACOMPANHAMENTO_CODIGO = "' + idAc + '" '

        sequelize.query(deleteAc)
            .then(result => {
                res.json(result[0])
            })
    }

    getInfosAcompanhamento(req, res) {
        const codigoAcompanhamento = req.params.codigoAcompanhamento

        sequelize.query(
            `SELECT 
            A.CODIGO AS CODIGO_ACOMPANHAMENTO,
            DATE_FORMAT(A.DATA_ACOMPANHAMENTO, '%d/%m/%Y') AS DATA_ACOMPANHAMENTO,
            A.ATIVIDADE,
            AF.ACOMPANHAMENTO_CODIGO,
            F.CODIGO_FUNCIONARIO AS CODIGO_FUNCIONARIO,
            F.CARGO AS CARGO_FUNCIONARIO,
            P.CODIGO AS CODIGO_PESSOA,
            GROUP_CONCAT(DISTINCT ' ',
                P.NOME,
                ' ',
                P.SOBRENOME,
                ' ',
                '(',
                F.CARGO,
                ')') AS NOME_FUNCIONARIO
        FROM
            ACOMPANHAMENTO AS A
                INNER JOIN
            ACOMPANHAMENTO_FUNCIONARIO AS AF ON AF.ACOMPANHAMENTO_CODIGO = A.CODIGO
                INNER JOIN
            FUNCIONARIO AS F ON AF.CODIGO_FUNCIONARIO = F.CODIGO_FUNCIONARIO
                INNER JOIN
            PESSOA AS P ON F.PESSOA_CODIGO = P.CODIGO
        WHERE
            A.CODIGO = ${codigoAcompanhamento}
        `
        )
            .then((infosAcompanhamento) => res.status(200).json(infosAcompanhamento[0]))
            .catch((error) => res.status(500).json(error))
    }
}
module.exports = new AcompanhamentoResidente()