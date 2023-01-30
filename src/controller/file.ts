import { Request, Response } from "express";
import { uploadFiles, deleteFiles } from '../helpers/files';
/* Add File Function */
export const uploadFile = async (req: Request, res: Response) => {
    try {

        const file = req.files?.file;
        const url = await uploadFiles(file);

        return res.status(201).json({
            ok: true,
            msg: "Archivo Guardado",
            url
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}

/* Delete Image Function */
export const deleteFile = async (req: Request, res: Response) => {
    try {

        const { url } = req.body;

        const message = await deleteFiles(url);

        return res.status(200).json({
            ok: true,
            msg: message
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}