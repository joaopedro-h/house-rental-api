import connection from "../../database/connection"; // Importa a conexão com o banco de dados.

class DashboardController {

    async show(req, res) {

        const {user_id} = req.headers;

        const sqlHouses =
        `SELECT * FROM houses
        WHERE user_id = ?`

        const [houses] = await connection.execute(sqlHouses,[user_id]);

        if (houses.length === 0) {
            return res.status(404).json({
                message: "Você não possui casas cadastradas!"})
        }

        return res.status(200).json({
            message: "Suas casas cadastradas!",
            casas: houses
        });
    }

}

export default new DashboardController();