import { NextFunction, Request, Response } from "express";

/* Middleware that check if is an admin rol */
export const isAdminRole = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user.roleid) {
        return res.status(400).json({
            ok: false,
            msg: "Se quiere verificar el role sin validar el token primero"
        })
    }

    const { roleid } = req.user;

    if (roleid != Number(process.env.ADMIN_ID)) {
        return res.status(401).json({
            ok: false,
            msg: `No autorizado`
        })
    }

    return next();
}