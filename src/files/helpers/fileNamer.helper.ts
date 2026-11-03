import { Request } from "express";
import {v4 as uuid} from 'uuid'

// ! EL OBJETIVO DE ESTA FUNCION ES EVALUAR EL ARCHIVO Y AISGNARLE UN NAME Y EXTENSION
export const fileNamer = (
    req: Request, 
    file: Express.Multer.File, 
    callback: Function
) => {

    // ? validacion si no viene el file, manda error y va hacia el bad request
    if (!file) 
        return callback(new Error('Files is empty'), '');

    const fileExtension = file.mimetype.split('/')[1];

    const fileName = `${uuid()}.${fileExtension}`

    // ? callback que deuelve el name, no error y el name
    callback(null, fileName);
}
