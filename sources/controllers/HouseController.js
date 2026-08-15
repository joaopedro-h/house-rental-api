import connection from "../../database/connection"; // Importa a conexão com o banco de dados.

class HouseController {
    
    async store(req, res) { // Método responsável por cadastrar uma nova casa.

        const {filename} = req.file; // Pega o nome do arquivo enviado pelo usuário.
        const {description, price, location, status} = req.body; // Pega as informações da casa enviadas pelo usuário.
        const {user_id} = req.headers; // Pega o ID do usuário enviado no cabeçalho da requisição.

        const sqlHouse = // Cria a query para cadastrar a casa no banco de dados.
        `INSERT INTO houses (thumbnail, description, price, location, status, user_id )
        VALUES (?,?,?,?,?,?)`

        const houseValues = [ // "houseValues" guarda os valores que serão enviados para o banco de dados.
            filename,
            description,
            price,
            location,
            status,
            user_id
        ]

        await connection.execute(sqlHouse, houseValues); // Executa o cadastro da casa no banco de dados.

        return res.status(201).json({ // Retorna os dados da casa cadastrada em formato JSON.
            message: "Casa cadastrada com sucesso",
            thumbnail: `http://localhost:3333/files/${filename}`, // Monta a URL para acessar a imagem cadastrada.
            description,
            price,
            location,
            status,
            user_id
        });

    }
}

export default new HouseController(); // Exporta uma nova instância do HouseController.