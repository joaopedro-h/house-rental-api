import {Router} from "express"; // Pega somente o Router que o Express disponibiliza.
import multer from "multer";
import uploadConfig from "./config/upload";

import SessionController from "./controllers/SessionController";
import HouseController from "./controllers/HouseController";

const routes = new Router(); // routes armazena o Router onde as rotas serão criadas.
const upload = multer(uploadConfig);

routes.post("/sessions", SessionController.store);

routes.post("/houses", upload.single("thumbnail"), HouseController.store);

routes.get("/houses", HouseController.index);

routes.put("/houses/:house_id", upload.single("thumbnail"), HouseController.update);

export default routes; // Exporta o routes para ser usado no app.js.