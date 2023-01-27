import { NextFunction, Request, Response } from "express";
import { User } from '../models';
import jwt from 'jsonwebtoken'

export const validateJwt = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.get('Authorization');
    token = (token) ? token.split(' ')[1] : token;

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: "No hay token"
        });
    }

    try {
        const data: any = jwt.verify(`${token}`, `${process.env.TOKEN_SEED}`);

        /* Search if the user exists */
        const { dataValues: user }: any = await User.findOne({ where: { userid: data.id } });
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: `Usuario o Password incorrecto`
            });
        }

        if (!user.isactive) {
            return res.status(400).json({
                ok: false,
                msg: `Usuario no disponible`
            });
        }

        req.user = {
            userid: user.userid,
            name: user.name,
            lastname: user.lastname,
            roleid: user.roleid
        }

        return next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: "Token no válido"
        });
    }
}
