import connection from "../../database/connection";

class HouseController {
    
    async store(req, res) {

        const {filename} = req.file;
        const {description, price, location, status} = req.body;
        const {user_id} = req.headers;

        const sqlHouse =
        `INSERT INTO houses (thumbnail, description, price, location, status, user_id )
        VALUES (?,?,?,?,?,?)`

        const houseValues = [
            filename,
            description,
            price,
            location,
            status,
            user_id
        ]

        await connection.execute(sqlHouse, houseValues);

        return res.status(201).json({message: "Casa cadastrada com sucesso!"})

    }
}

export default new HouseController();