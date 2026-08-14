import multer from "multer"; // Importa o multer para poder trabalhar com o upload dos arquivos.
import path from "path"; // Importa o path para ajudar a montar os caminhos das pastas e arquivos.

export default {
    storage: multer.diskStorage({ // Configura onde e como os arquivos enviados vão ser salvos.
        destination: path.resolve(__dirname, "..", "..", "uploads"), // Define a pasta "uploads" como o local onde os arquivos serão salvos.
        filename: (req, file, callback) => { // Define como vai ficar o nome do arquivo depois que ele for salvo.
            const ext = path.extname(file.originalname); // Pega a extensão do arquivo original, como ".jpg" ou ".png".
            const name = path.basename(file.originalname, ext); // Pega o nome do arquivo sem a extensão.

            callback(null, `${name}-${Date.now()}${ext}`) // Salva o arquivo usando o nome original + a data atual para evitar nomes iguais.
        },
    })
};