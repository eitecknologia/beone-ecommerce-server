import { NextFunction, Request, Response } from "express";

export const validateFile = (req: Request, res: Response, next: NextFunction) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({
            ok: false,
            msg: "No hay archivos para subir"
        });
    }

    return next();
}