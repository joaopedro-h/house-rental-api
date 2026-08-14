import connection from "../../database/connection"; // Importa a conexão com o banco de dados.

class SessionController {

    async store (req, res){ // Método responsável por cadastrar um novo usuário.
        
        const {email} = req.body; // Pega o email enviado pelo usuário no corpo da requisição.

        const sqlEmail = // Cria a query para verificar se esse email já está cadastrado.
        `SELECT email FROM users
        WHERE email = ?`

        const [result] = await connection.execute(sqlEmail,[email]); // Executa a consulta e guarda os registros encontrados em "result".

        if (result.length > 0) { // Verifica se já existe algum usuário com esse email.
            return res.status(409).json({message: "Email já em uso!"});
        }

        const sqlUser = // Cria a query para cadastrar o novo usuário.
        `INSERT INTO users (email)
        VALUES (?)`;

        await connection.execute(sqlUser,[email]); // Executa o cadastro do usuário no banco de dados.

        return res.status(201).json({message: "Usuário cadastrado com sucesso!"}); // Retorna uma mensagem informando que o usuário foi cadastrado com sucesso.
    }
}

export default new SessionController(); // Exporta uma nova instância do SessionController.