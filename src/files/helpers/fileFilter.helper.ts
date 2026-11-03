import { Request } from "express";

// ! EL OBJETIVO DE ESTA FUNCION ES EVALUAR EL ARCHIVO Y VER SI ESTA EN 
// ! CONDICIONES PARA TRATARLO O RECHAZARLO Y NO TRATARLO
export const fileFilter = (
    req: Request, 
    file: Express.Multer.File, 
    callback: Function
) => {

    // ? validacion si no viene el file, manda error y va hacia el bad request
    if (!file) 
        return callback(new Error('Files is empty'), false);

    // ? obtenemos la extension del file
    const fileExtension = file.mimetype.split('/')[1];

    // ? extensiones que se manejaran
    const validExtension = ['jpg', 'png', 'jpeg', 'gif'];

    // ? validacion si incluye las extensiones
    if (validExtension.includes(fileExtension)) {
        return callback(null, true);
    }

    // ? si no incluye devuelve un false y no lo trata al file, y deja vacio file
    callback(null, false);
}
