const express = require("express");
const routes = require("./routes");

// Classe para configurar o Express.
class App {

    constructor() {
    
        
        this.server = express(); // Cria o servidor do Express.

        // Chama as funções para configurar os middlewares e as rotas.
        this.middlewares();
        this.routes();
    }

    // Configura os middlewares.
    middlewares(){

        this.server.use(express.json()); // Permite receber informações em JSON através do req.body.
    }

    // Configura as rotas.
    routes(){

        this.server.use(routes); // Adiciona as rotas que foram criadas lá no arquivo "routes.js".
    }
}

module.exports = new App().server; // Cria uma nova aplicação da classe App, e exporta o server do Express.