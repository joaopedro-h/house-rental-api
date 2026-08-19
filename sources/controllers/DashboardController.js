import connection from "../../database/connection"; // Importa a conexão com o banco de dados.

class DashboardController {

    async show(req, res) {

        const {user_id} = req.headers; // Pega o ID do usuário enviado no cabeçalho(headers) da requisição.

        const sqlHouses = // Cria a query para consultar todas as casas do usuário.
        `SELECT * FROM houses
        WHERE user_id = ?`

        const [houses] = await connection.execute(sqlHouses,[user_id]); // Executa a consulta e guarda o resultado em "houses".

        if (houses.length === 0) { // Verifica se o usuário possui cadas cadastradas.
            return res.status(404).json({
                message: "Você não possui casas cadastradas!"
            });
        }

        return res.status(200).json({ // Retorna as casas do cadastradas do usuário.
            message: "Suas casas cadastradas!",
            casas: houses
        });
    }

}

export default new DashboardController();