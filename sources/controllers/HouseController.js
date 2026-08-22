import connection from "../../database/connection"; // Importa a conexão com o banco de dados.
import * as Yup from "yup";

class HouseController {
    
    async index(req, res) { // Método responsável por filtrar uma casa de acordo com o status selecionado: true ou false.

        const {status} = req.query; // Pega o status informado nos parâmetros da query.

        const sqlHousesIndex = // Cria a query para buscar as casas de acordo com o status informado.
        `SELECT * FROM houses
        WHERE status = ?`

        const [result] = await connection.execute(sqlHousesIndex, [status]); // Executa a consulta passando o status informado, guardando o resultado em "result".

        return res.status(200).json(result); // Retorna as casas encontradas de acordo com o status selecionado.

    }

    async update(req, res) { // Método responsável por editar uma casa já cadastrada.

        const schema = Yup.object().shape({
            description: Yup.string().required(),
            price: Yup.number().required(),
            location: Yup.string().required(),
            status: Yup.boolean().required()
        })

        const {filename} = req.file; // Pega o nome do arquivo enviado pelo usuário.
        const {house_id} = req.params; // Pega o ID da casa informado na URL da requisição.
        const {description, price, location, status} = req.body; // Pega as informações da casa enviadas pelo usuário.
        const {user_id} = req.headers;

        if (!(await schema.isValid(req.body))) { // Verifica se os dados enviados pelo usuário são válidos de acordo com o schema de validação.
                return res.status(400).json({
                message: "Falha na validação dos dados!"
            })
        }

        const sqlHouseUpdate = // Cria a query para atualizar os dados da casa.
        `UPDATE houses
         SET thumbnail = ?,
         description = ?,
         price = ?,
         location = ?,
         status = ?
        WHERE id = ? AND user_id = ?`

        const houseValuesUpdate = [ // Cria um array com os valores que serão usados na atualização da casa.
            filename,
            description,
            price,
            location,
            status,
            house_id,
            user_id
        ]

        const [result] = await connection.execute(sqlHouseUpdate, houseValuesUpdate); // Executa a consulta passando os valores da casa, armazenando o resultado em "result".

        if (result.affectedRows === 0) {
            return res.status(403).json({
                message: "Você não é o proprietário dessa casa!"
            });
        }        

        return res.status(200).json({ // Retorna os dados da casa depois da atualização.
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

        const schema = Yup.object().shape({
            description: Yup.string().required(),
            price: Yup.number().required(),
            location: Yup.string().required(),
            status: Yup.boolean().required()
        })

        const {filename} = req.file; // Pega o nome do arquivo enviado pelo usuário.
        const {description, price, location, status} = req.body; // Pega as informações da casa enviadas pelo usuário.
        const {user_id} = req.headers; // Pega o ID do usuário enviado no cabeçalho da requisição.

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({
                message: "Falha na validação dos dados!"
            });
        }

        const sqlUser = // Cria a query para buscar um usuário com o ID informado na requisição.
        `SELECT id FROM users
        WHERE id = ?;`

        const [users] = await connection.execute(sqlUser,[user_id]);

        if (users.length === 0) {
            return res.status(404).json({
                message: "Usuário não encontrado!"
            });
        }

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

        const {house_id} = req.params; // Pega o ID da casa informado na URL da requisição.
        const {user_id} = req.headers; // Pega o ID do usuário enviado no cabeçalho(headers) da requisição.

        const sqlDeleteHouse = // Cria a query para excluir a casa informada.
        `DELETE FROM houses
        WHERE id = ? AND user_id = ?;`

        const [result] = await connection.execute(sqlDeleteHouse,[house_id, user_id]); // Executa a consulta passando o ID da casa e do usuário, guardando o resultado em "result".

        if (result.affectedRows === 0) { // Verifica se nenhuma casa foi excluída, indicando que o usuário não é o proprietário.
            return res.status(403).json({
                message: "Você não é o proprietário dessa casa!"
            });
        }

        return res.status(200).json({
            message: "Casa excluída com sucesso!"
        });
    }

    async valueFilter(req, res) { // Método responsável por filtras casas por valores escolhidos pelo o usuário.
        
        const {minValue, maxValue} = req.query; // Pega os valores mínimo e máximo informados nos parâmetros da query.

        const sqlValues = // Cria a query para buscar casas dentro da faixa de valores informada.
        `SELECT 
        description,
        price,
        location,
        status
        FROM houses
        WHERE price BETWEEN ? AND ?
        ORDER BY price ASC;`

        const [housesResult] = await connection.execute(sqlValues, [minValue, maxValue]); // Executa a consulta passando os valores mínimo e máximo, guardando o resultado em "housesResult".

        return res.status(200).json({ // Retorna as casas encontradas dentro dos valores informados.
            message: `Casas encontradas nos valores entre R$${minValue} e $R$${maxValue}`,
            casas: housesResult
        });
    }

}

export default new HouseController(); // Exporta uma nova instância do HouseController.