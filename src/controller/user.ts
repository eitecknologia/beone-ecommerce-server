import { Request, Response } from "express";
import User from '../models/User';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
/* Get All Admins Function */
export const getUserLoggedInfo = async (req: Request, res: Response) => {
    try {

        const userid = req.user.userid;
        const user = await User.findOne({
            attributes: { exclude: ['password', 'isactive', 'google', 'facebook', 'timecreated', 'roleid'] },
            where: { userid }
        })

        return res.status(200).json({
            ok: true,
            msg: "Información de usuario",
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

/* Update user Function */
export const updateUser = async (req: Request, res: Response) => {
    try {

        let { ci, name, lastname, email, password, address }: User = req.body;
        const { userid } = req.user;

        /* Verify that the new credentials not exist */
        const userTotal = await User.count({
            where:
            {
                [Op.or]: [{
                    [Op.and]: [{ ci, roleid: process.env.USER_ID, userid: { [Op.ne]: userid } }]
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
            msg: "Usuario actualizado"
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