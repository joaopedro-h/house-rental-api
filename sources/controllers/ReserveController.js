import connection from "../../database/connection";

class ReserveController {

    async store(req, res){

        const {user_id} = req.headers; // Pega o ID do usuário enviado no cabeçalho(headers) da requisição.
        const {house_id} = req.params; // Pega o ID da casa informado na URL da requisição.

        const sqlUser = // Cria a query para verificar se o usuário existe.
        `SELECT id FROM users
        WHERE id = ?;`

        const [user] = await connection.execute(sqlUser,[user_id]); // Executa a consulta e guarda o resultado em "user".

        if (user.length === 0) { // Verifica se não foi encontrado nenhum usuário com esse ID.
            return res.status(404).json({
                message: "Usuário não encontrado!"
            });
        }

        const sqlHouse = // Cria a query para buscar a casa e informação sobre o proprietário.
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

        const [house] = await connection.execute(sqlHouse,[house_id]); // Executa a consulta e guarda os dados da casa em "house".

        if (house.length === 0) { // Verifica se a casa informada realmente existe.
            return res.status(404).json({
                message: "Casa não encontrada!"
            });
        }

        if (house[0].user_id === Number(user_id)) { // Verifica se o usuário está tentando reservar a própria casa.
            return res.status(403).json({
                message: "Você não pode reservar sua própria casa!"
            });
        }

        if (house[0].status === 0) { // Verifica se a casa já está indisponível para locação.
            return res.status(409).json({
                message: "Casa indisponível para locação!"
            });
        }

        const conn = await connection.getConnection(); // Pega uma conexão do pool para poder iniciar a transação.
        
        try {

            await conn.beginTransaction(); // Inicia uma transação para garantir que a atualização da casa e a reserva sejam feitas juntas.

            const sqlHouseUpdate = // Cria a query para deixar a casa indisponível após ser reservada.
            `UPDATE houses
            SET status = 0
            WHERE id = ? AND status = 1;`

            const [houseUpdated] = await conn.execute(sqlHouseUpdate,[house_id]); // Executa a atualização e guarda o resultado em "houseUpdated".

            if (houseUpdated.affectedRows === 0) { // Verifica se a casa não foi atualizada, indicando que ela ficou indisponível antes da reserva ser feita.
                await conn.rollback();
                return res.status(409).json({
                    message: "Casa indisponível para locação!"
                });
            }

            const sqlReserve = // Cria a query para registrar a reserva da casa.
            `INSERT INTO reservations (user_id, house_id)
            VALUES(?,?);`

            await conn.execute(sqlReserve,[user_id, house_id]); // Cadastra a reserva relacionando o usuário com a casa.

            await conn.commit(); // Confirma a transação e salva todas as alterações no banco de dados.

            return res.status(201).json({ // Retorna uma resposta informando que a casa foi reservada com sucesso.
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
            
            await conn.rollback(); // Desfaz as alterações realizadas caso aconteça algum erro durante a reserva.

            return res.status(500).json({
                message: "Erro ao reservar a casa!"
            });
        }
        
    }

    async index(req, res){

        const {user_id} = req.headers;

        const sqlReservesUser = 
        `SELECT 
            r.id AS "ID da reserva",
            r.date AS "Data",
            u.email AS "Email do locatário",
            h.thumbnail AS "Foto da casa",
            h.description AS "Descrição",
            h.price AS "Preço",
            h.location AS "Localização",
            u2.email AS "Email do locador"
    
        FROM reservations r

        JOIN users u 
        ON r.user_id = u.id

        JOIN houses h
        ON r.house_id = h.id

        JOIN users u2
        ON h.user_id = u2.id

        WHERE u.id = ?;`

        const [reserves] = await connection.execute(sqlReservesUser,[user_id]);

        if (reserves.length === 0) {
            return res.status(404).json({
                message: "Você não tem casas reservadas!"
            });
        }

        return res.status(200).json({
            message: "Suas casas reservadas!",
            casas: reserves
        });

    }

}

export default new ReserveController();