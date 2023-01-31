import { Request, Response } from "express";
import bcrypt from 'bcrypt';

import { createDefaultRoles } from '../helpers/db-helpers';
import { Role, User } from '../models';
import { generateRandomString } from "../helpers/random-string";
import { sendAdminCredentials } from '../helpers/msg-email';
import { sendMail } from "../helpers/send-email";
import { generateJwt } from "../helpers/generate-jwt";

/* Register Admin Function */
export const registerAdmin = async (req: Request, res: Response) => {
    try {
        let { ci, name, lastname, email, address }: User = req.body;

        /* Search if the roles table is Ready */
        const rolesExists = await Role.findByPk(process.env.ADMIN_ID);
        if (!rolesExists) {
            await createDefaultRoles();
        }

        /* Search if the user exists */
        const userExist = await User.findOne({ where: { email, isactive: true } });
        if (userExist) {
            return res.status(400).json({
                ok: false,
                msg: `El correo ${email} ya se encuentra registrado`
            });
        }

        /* Search if exist an admin with the same CI */
        const userExistCI = await User.findOne({ where: { ci, roleid: process.env.ADMIN_ID, isactive: true } });
        if (userExistCI) {
            return res.status(400).json({
                ok: false,
                msg: `El ci ${ci} ya se encuentra registrado para un administrador`
            });
        }

        /* Generate new password */
        let passwordGenerated = `Beone_${generateRandomString(5)}`;
        /* Encript Password */
        const salt = bcrypt.genSaltSync();
        const password = bcrypt.hashSync(passwordGenerated, salt);


        const user = await User.create({
            ci,
            name,
            lastname,
            address,
            email,
            password,
            roleid: Number(process.env.ADMIN_ID)
        })

        await sendMail(email, sendAdminCredentials(`${name} ${lastname}`, email, passwordGenerated), "Credenciales de Acceso");

        return res.status(201).json({
            ok: true,
            msg: "Administrador Creado",
            user: {
                userid: user.userid,
                ci: user.ci,
                name: user.name,
                lastname: user.lastname,
                address: user.address,
                email: user.email
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}

/* Login Admin Function */
export const loginAdmin = async (req: Request, res: Response) => {
    try {

        let { email, password } = req.body;

        /* Search if the user exists */
        const user = await User.findOne({ where: { email: email, roleid: process.env.ADMIN_ID } });

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: `Usuario o Password incorrecto`
            });
        }

        /* Verify de user state */
        if (!user.isactive) {
            return res.status(400).json({
                ok: false,
                msg: `Usuario no se encuentra disponible`
            });
        }

        /* Verify password */
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: `Usuario o Password incorrecto`
            });
        }

        /* Generate JWT */
        const token = await generateJwt(user.userid);

        return res.status(200).json({
            ok: true,
            msg: "Administrador Logueado",
            user: {
                userid: user.userid,
                name: user.name,
                lastname: user.lastname,
                email: user.email
            },
            token
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}