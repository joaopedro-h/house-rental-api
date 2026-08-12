import connection from "../../database/connection";

class SessionController {

    async store (req, res){
        
        const {email} = req.body;

        const sqlUser =
        `INSERT INTO users (email)
        VALUES (?)`;

        await connection.execute(sqlUser,[email]);

        return res.send("Usuário cadastrado com sucesso!");
    }
}

export default new SessionController();