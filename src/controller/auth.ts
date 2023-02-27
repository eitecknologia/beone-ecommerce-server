import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';

import { createDefaultRoles } from '../helpers/db-helpers';
import { Role, User } from '../models';
import { generateRandomString } from "../helpers/random-string";
import { sendAdminCredentials, recoverPasswordMsg } from '../helpers/msg-email';
import { sendMail } from "../helpers/send-email";
import { generateJwt } from "../helpers/generate-jwt";
import jwt from 'jsonwebtoken';

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

/* Register User Function */
export const registerUser = async (req: Request, res: Response) => {
    try {
        let { ci, name, lastname, email, address, password }: User = req.body;

        /* Search if the user exists */
        const userExist = await User.findOne({ where: { email, isactive: true } });
        if (userExist) {
            return res.status(400).json({
                ok: false,
                msg: `El correo ${email} ya se encuentra registrado`
            });
        }

        /* Search if exist an admin with the same CI */
        const userExistCI = await User.findOne({ where: { ci, roleid: process.env.USER_ID, isactive: true } });
        if (userExistCI) {
            return res.status(400).json({
                ok: false,
                msg: `El ci ${ci} ya se encuentra registrado para un usuario`
            });
        }

        /* Encript Password */
        const salt = bcrypt.genSaltSync();
        const newPassword = bcrypt.hashSync(password, salt);


        const user = await User.create({
            ci,
            name,
            lastname,
            address,
            email,
            password: newPassword,
            roleid: Number(process.env.USER_ID)
        })

        return res.status(201).json({
            ok: true,
            msg: "Usuario Creado",
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

/* Login User Function */
export const loginUser = async (req: Request, res: Response) => {
    try {

        let { email, password } = req.body;

        /* Search if the user exists */
        const user = await User.findOne({ where: { email: email, roleid: process.env.USER_ID } });

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
            msg: "Usuario Logueado",
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

/* Login with google Function */
export const loginGoogle = async (req: Request, res: Response) => {
    try {

        const { accessToken } = req.body;
        const urlGoogleSignIn = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`
        const resp = await fetch(`${urlGoogleSignIn}`).then(r => r.json());

        const email = resp?.email || null;
        const given_name = resp?.given_name || null;
        const family_name = resp?.family_name || null;
        const sub = resp?.sub || null;

        if (!email || !given_name || !family_name) {
            return res.status(200).json({
                ok: false,
                msg: "Error con las credenciales de google"
            })
        }


        let user = await User.findOne({ where: { email } })



        if (!user) {
            /* Create new user */
            user = await User.create({
                ci: `${sub}`,
                name: `${given_name}`,
                lastname: `${family_name}`,
                email: `${email}`,
                address: "---",
                password: "---",
                roleid: Number(process.env.USER_ID),
                google: true
            })
        }

        if (!user?.isactive) {
            return res.status(400).json({
                ok: false,
                msg: "Usuario de encuentra bloqueado"
            })
        }

        if (user.facebook) {
            return res.status(400).json({
                ok: false,
                msg: "Usuario ya se encuentra registrado con facebook"
            })
        }

        if (!user.facebook && !user.google) {
            return res.status(400).json({
                ok: false,
                msg: "El usuario ya se encuentra registrado normalmente"
            })
        }
        /* Generate JWT */
        const token = await generateJwt(user.userid);

        return res.status(200).json({
            ok: true,
            msg: "Login exitoso",
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

/* Login with google Function */
export const loginFacebook = async (req: Request, res: Response) => {
    try {

        const { accessToken } = req.body;
        const urlFacebookSingIn = `https://graph.facebook.com/v2.3/me?access_token=${accessToken}&fields=name%2Cemail%2Cpicture`;
        const resp = await fetch(`${urlFacebookSingIn}`).then(r => r.json());

        const email = resp?.email || null;
        const name = resp.name?.split(" ")[0] || null;
        const lastname = resp.name?.split(" ")[1] || "---";
        const id = resp?.id || null;

        if (!email || !name || !id) {
            return res.status(200).json({
                ok: false,
                msg: "Error con las credenciales de facebook"
            })
        }

        let user = await User.findOne({ where: { email } })

        if (!user) {
            /* Create new user */
            user = await User.create({
                ci: `${id}`,
                name: `${name}`,
                lastname: `${lastname}`,
                email: `${email}`,
                address: "---",
                password: "---",
                roleid: Number(process.env.USER_ID),
                facebook: true
            })
        }

        if (!user?.isactive) {
            return res.status(400).json({
                ok: false,
                msg: "Usuario de encuentra bloqueado"
            })
        }

        if (user.google) {
            return res.status(400).json({
                ok: false,
                msg: "Usuario ya se encuentra registrado con facebook"
            })
        }

        if (!user.facebook && !user.google) {
            return res.status(400).json({
                ok: false,
                msg: "El usuario ya se encuentra registrado normalmente"
            })
        }
        /* Generate JWT */
        const token = await generateJwt(user.userid);

        return res.status(200).json({
            ok: true,
            msg: "Login exitoso",
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

/* Recover Password Function */
export const recoverPassword = async (req: Request, res: Response) => {
    try {

        const { email } = req.body;
        const isAdmin = req.query.isAdmin;

        /* Get user Data */
        const user = await User.findOne({
            where: {
                email: email,
                isactive: true,
                ...(isAdmin == "true") ? { roleid: process.env.ADMIN_ID } : { roleid: process.env.USER_ID }
            }
        });

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: `Usuario ${email} no encontrado`,
            });
        }

        if (user.facebook || user.google) {
            return res.status(400).json({
                ok: false,
                msg: `Usuario registrado con red social`,
            });
        }

        const { userid } = user;

        /* Generate JWT */
        const token = await generateJwt(userid);

        const urlRecoverPassword = (isAdmin == "true") ? process.env.URL_RECOVER_PASSWORD_ADMIN : process.env.URL_RECOVER_PASSWORD_USER
        const path = `${urlRecoverPassword}?userid=${userid}&token=${token}`

        await sendMail(email, recoverPasswordMsg(path), "Recuperar password");

        return res.status(200).json({
            ok: true,
            msg: `Solicitud de recuperación enviada a ${email}`
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}


/* RECOVER PASSWORD -CLIENT */
export const recoverPasswordReset = async (req: Request, res: Response) => {
    try {
        let { userid, token, password } = req.body;

        const { id }: any = jwt.verify(`${token}`, `${process.env.TOKEN_SEED}`);

        if (id != userid) {
            return res.status(401).json({
                ok: false,
                msg: `No autorizado`
            })
        }

        const salt = bcrypt.genSaltSync();
        password = bcrypt.hashSync(password, salt);

        await User.update({
            password
        }, { where: { userid: id } })

        return res.status(200).json({
            ok: true,
            msg: `Contraseña actualizada`
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}
