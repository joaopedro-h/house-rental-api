import {Router} from "express"; // Pega somente o Router que o Express disponibiliza.
import connection from "../database/connection";

const routes = new Router(); // routes armazena o Router onde as rotas serão criadas.

routes.post("/teste", async (req, res) => {

    const {nome} = req.body;

    const sqlInsert = 
    ` INSERT INTO casas (nome)
    VALUES (?)`;

    await connection.execute(sqlInsert,[nome]);

    return res.send("Adicionado com sucesso!")

});

export default routes; // Exporta o routes para ser usado no app.js.