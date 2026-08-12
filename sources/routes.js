import {Router} from "express"; // Pega somente o Router que o Express disponibiliza.
import SessionController from "./controllers/SessionController";

const routes = new Router(); // routes armazena o Router onde as rotas serão criadas.

routes.post("/sessions", SessionController.store);

export default routes; // Exporta o routes para ser usado no app.js.