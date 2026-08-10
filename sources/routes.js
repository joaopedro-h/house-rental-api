const {Router} = require("express"); // Pega somente o Router que o Express disponibiliza.

const routes = new Router(); // routes armazena o Router onde as rotas serão criadas.

routes.get("/teste", (req, res) => {

    return res.json({erro: "teste"});
    
});

module.exports = routes; // Exporta o routes para ser usado no app.js.