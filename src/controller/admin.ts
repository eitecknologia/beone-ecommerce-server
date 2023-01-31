import { Request, Response } from "express";
import { Op } from "sequelize";
import { infoPaginate, validatePaginateParams } from "../helpers/pagination";
import { User } from "../models";
import bcrypt from 'bcrypt';

/* Get All Admins Function */
export const getAllAdmins = async (req: Request, res: Response) => {
    try {
        /* Pagination Params */
        const { page, size } = req.query;
        const { offset, limit, pageSend, sizeSend } = await validatePaginateParams(page, size);

        /* Get users data */
        const { count: total, rows: users } = await User.findAndCountAll({
            attributes: ['userid', 'ci', 'name', 'lastname', 'address', 'email'],
            where: { roleid: process.env.ADMIN_ID, isactive: true },
            order: [['timecreated', 'DESC']],
            offset: (offset - sizeSend),
            limit
        })

        /* Calculate the total of pages */
        const totalPages = (Math.ceil(total / limit));
        const info = await infoPaginate(totalPages, total, pageSend, sizeSend);

        return res.status(200).json({
            ok: true,
            msg: "Listado de Administradores",
            info,
            users
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}

/* Get an admin by id Function */
export const findAdminById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({
            attributes: ['userid', 'ci', 'name', 'lastname', 'address', 'email'],
            where: { userid: id }
        });

        return res.status(200).json({
            ok: true,
            msg: "Usuario encontrado",
            user
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}

/* Update Admin Function by logged admin */
export const updateAdmin = async (req: Request, res: Response) => {
    try {

        let { ci, name, lastname, email, password, address }: User = req.body;
        const { userid } = req.user;

        /* Verify that the new credentials not exist */
        const userTotal = await User.count({
            where:
            {
                [Op.or]: [{
                    [Op.and]: [{ ci, roleid: process.env.ADMIN_ID, userid: { [Op.ne]: userid } }]
                },
                {
                    [Op.and]: [{ email, userid: { [Op.ne]: userid } }]
                }
                ]
            }
        })

        /* Return error if the ci or email exist */
        if (userTotal > 1) {
            return res.status(400).json({
                ok: false,
                msg: `Ya se encuentra registrado ${ci} o ${email}`
            });
        }

        /* Encript the new password */
        if (password) {
            const salt = bcrypt.genSaltSync();
            password = bcrypt.hashSync(password, salt);
        }

        await User.update({
            name, lastname, email, password, ci, address
        }, { where: { userid } });

        return res.status(200).json({
            ok: true,
            msg: "Administrador Actualizado"
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

/* Delete Admin Function */
export const deleteAdmin = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        await User.destroy({ where: { userid: id } });

        return res.status(200).json({
            ok: true,
            msg: "Administrador Eliminado"
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}