import connection from "../../database/connection";

class HouseController {
    
    async store(req, res) {
        console.log(req.body);
        console.log(req.file);
        
        return res.json({message: true})

    }

}

export default new HouseController();