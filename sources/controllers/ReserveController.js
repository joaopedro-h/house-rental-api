import connection from "../../database/connection";

class ReserveController {

    async store(req, res){

        const {user_id} = req.headers;
        const {house_id} = req.params;

        const sqlUser =
        `SELECT id FROM users
        WHERE id = ?;`

        const [user] = await connection.execute(sqlUser,[user_id]);

        if (user.length === 0) {
            return res.status(404).json({
                message: "Usuário não encontrado!"
            });
        }

        const sqlHouse =
        `SELECT 
            h.id,
            h.user_id,
            h.status,
            h.thumbnail,
            h.description,
            h.location,
            u.email
        FROM houses h
        JOIN users u
        ON h.user_id = u.id
        WHERE h.id = ?;`;

        const [house] = await connection.execute(sqlHouse,[house_id]);

        if (house.length === 0) {
            return res.status(404).json({
                message: "Casa não encontrada!"
            });
        }

        if (house[0].user_id === Number(user_id)) {
            return res.status(403).json({
                message: "Você não pode reservar sua própria casa!"
            });
        }

        if (house[0].status === 0) {
            return res.status(409).json({
                message: "Casa indisponível para locação!"
            });
        }

        const conn = await connection.getConnection();
        
        try {

            await conn.beginTransaction();

            const sqlHouseUpdate =
            `UPDATE houses
            SET status = 0
            WHERE id = ? AND status = 1;`

            const [houseUpdated] = await conn.execute(sqlHouseUpdate,[house_id]);

            if (houseUpdated.affectedRows === 0) {
                await conn.rollback();
                return res.status(409).json({
                    message: "Casa indisponível para locação!"
                });
            }

            const sqlReserve =
            `INSERT INTO reservations (user_id, house_id)
            VALUES(?,?);`

            await conn.execute(sqlReserve,[user_id, house_id]);

            await conn.commit();

            return res.status(201).json({
                message: "Casa reservada com sucesso!",
                casa: {
                    "ID da casa": house[0].id,
                    "Foto da casa": house[0].thumbnail,
                    "Descrição": house[0].description,
                    "Localizaçao": house[0].location,
                    "Proprietário": house[0].email
                }
            });

        } catch (error) {
            
            await conn.rollback();

            return res.status(500).json({
                message: "Erro ao reservar a casa!"
            });
        }
        
    }
}

export default new ReserveController();