import connection from "../../database/connection"; // Importa a conexão com o banco de dados.

class HouseController {
    
    async index(req, res) { // Método responsável por filtrar uma casa de acordo com o status selecionado: true ou false.

        const {status} = req.query;

        const sqlHousesIndex = 
        `SELECT * FROM houses
        WHERE status = ?`

        const [result] = await connection.execute(sqlHousesIndex, [status]);

        return res.status(200).json(result);

    }

    async update(req, res) { // Método responsável por editar uma casa já cadastrada.

        const {filename} = req.file;
        const {house_id} = req.params;
        const {description, price, location, status} = req.body; // Pega as informações da casa enviadas pelo usuário.
        const {user_id} = req.headers;

        const sqlHouseUpdate =
        `UPDATE houses
         SET thumbnail = ?,
         description = ?,
         price = ?,
         location = ?,
         status = ?
        WHERE id = ? AND user_id = ?`

        const houseValuesUpdate = [
            filename,
            description,
            price,
            location,
            status,
            house_id,
            user_id
        ]

        const [result] = await connection.execute(sqlHouseUpdate, houseValuesUpdate);

        if (result.affectedRows === 0) {
            return res.status(403).json({message: "Você não é o proprietário dessa casa!"});
        }        

        return res.status(200).json({
            message: "Casa editada com sucesso!",
            thumbnail: `http://localhost:3333/files/${filename}`,
            description,
            price,
            location,
            status,
            user_id
        });

    }

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

    async destroy(req, res) { // Método responsável por excluir uma casa.

        const {house_id} = req.params;
        const {user_id} = req.headers;

        const sqlDeleteHouse =
        `DELETE FROM houses
        WHERE id = ? AND user_id = ?;`

        const [result] = await connection.execute(sqlDeleteHouse,[house_id, user_id]);

        if (result.affectedRows === 0) {
            return res.status(403).json({message: "Você não é o proprietário dessa casa!"});
        }

        return res.status(200).json({message: "Casa excluída com sucesso!"})
    }

    async valueFilter(req, res) {
        
        const {minValue, maxValue} = req.query;

        const sqlValues =
        `SELECT 
        description,
        price,
        location,
        status
        FROM houses
        WHERE price BETWEEN ? AND ?
        ORDER BY price ASC;`

        const [housesResult] = await connection.execute(sqlValues, [minValue, maxValue]);

        return res.status(200).json({
            message: `Casas encontradas nos valores entre R$${minValue} e $R$${maxValue}`,
            casas: housesResult
        });
    }

}

export default new HouseController(); // Exporta uma nova instância do HouseController.