import connection from "../../database/connection";

class SessionController {

    async store (req, res){
        
        const {email} = req.body;

        const sqlEmail =
        `SELECT email FROM users
        WHERE email = ?`

        const [result] = await connection.execute(sqlEmail,[email]);

        if (result.length > 0) {
            return res.status(409).json({message: "Email já em uso!"});
        }

        const sqlUser =
        `INSERT INTO users (email)
        VALUES (?)`;

        await connection.execute(sqlUser,[email]);

        return res.status(201).json({message: "Usuário cadastrado com sucesso!"});
    }
}

export default new SessionController();