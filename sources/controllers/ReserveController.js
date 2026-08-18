import connection from "../../database/connection";

class ReserveController {

    async store(req, res){

        const {user_id} = req.headers;
        const {house_id} = req.params;

        const sqlUser = // Cria a query para buscar um usuário com o ID informado na requisição.
        `SELECT id FROM users
        WHERE id = ?;`

        const [users] = await connection.execute(sqlUser,[user_id]);

        if (users.length === 0) {
            return res.status(404).json({
                message: "Usuário não encontrado!"
            });
        }

        const sqlHouse =
        `UPDATE houses
         SET status = 0
        WHERE id = ? AND status = 1;`

        const [result] = await connection.execute(sqlHouse, [house_id]);

        if (result.affectedRows === 0) {
            return res.status(401).json({
                message: "Casa indisponível para locação!"
            });
        }

        const sqlReserve =
        `INSERT INTO reservations (user_id, house_id)
        VALUES(?,?);`

        await connection.execute(sqlReserve,[user_id, house_id]);

        const sqlHouseReserved =
        `SELECT 
         h.id AS "ID da casa",
         h.thumbnail AS "Foto da casa",
         h.description AS "Descrição",
         h.location AS "Localização",
         u.email AS "Proprietário(a)"
        
         FROM houses h

         JOIN users u
         ON h.user_id = u.id
        WHERE h.id = ?;`

        const [houseReserved] = await connection.execute(sqlHouseReserved,[house_id]);

        return res.status(200).json({
            message: "Casa reservada com sucesso!",
            casa: houseReserved
        });
    }
}

export default new ReserveController();