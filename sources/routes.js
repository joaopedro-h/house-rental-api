import {Router} from "express"; // Pega somente o Router que o Express disponibiliza.
import multer from "multer";
import uploadConfig from "./config/upload";
import SessionController from "./controllers/SessionController";
import HouseController from "./controllers/HouseController";
import DashboardController from "./controllers/DashboardController";
import ReserveController from "./controllers/ReserveController";

const routes = new Router(); // routes armazena o Router onde as rotas serão criadas.
const upload = multer(uploadConfig);

routes.post("/sessions", SessionController.store); // Cria rota para realizar login do usuário.

routes.post("/houses", upload.single("thumbnail"), HouseController.store); // Cria rota para cadastrar uma casa.

routes.get("/houses", HouseController.index); // Cria rota para listar as casas disponíveis para alugar.

routes.put("/houses/:house_id", upload.single("thumbnail"), HouseController.update); // Cria rota para atualizar uma casa que seja do usuário.

routes.delete("/houses/:house_id", HouseController.destroy); // Cria rota para excluir uma casa que seja do usuário.

routes.get("/houses/filter", HouseController.valueFilter); // Cria rota para filtrar casas por valor, ex: "Casas entre R$1500 e R$2000".

routes.get("/dashboard", DashboardController.show); // Cria rota para acessar o dashboard, mostrando as casas cadastradas do usuário.

routes.post("/houses/:house_id/reserve", ReserveController.store); // Cria rota para reservar uma casa de algum outro usuário.

routes.get("/reserves", ReserveController.index); // Cria rota para listar as reservas feitas.

routes.delete("/reserves/cancel/:reserve_id", ReserveController.destroy); // Cria rota para cancelar uma reserva feita.

export default routes; // Exporta o routes para ser usado no app.js.