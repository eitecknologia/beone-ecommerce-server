import { Role, User } from "../models";

/* Create Defaul Roles */
export const createDefaultRoles = async () => {
    await Promise.all([
        Role.create({
            roleid: Number(process.env.ADMIN_ID),
            name: "ADMIN_ROLE"
        }),
        Role.create({
            roleid: Number(process.env.USER_ID),
            name: "USER_ROLE"
        })
    ]);
}

/* Verify if exist admin id */
export const verifyAdminId = async (id: number) => {
    /* Search if the user exists */
    const existUser = await User.findOne({ where: { userid: id, roleid: process.env.ADMIN_ID, isactive: true } });
    if (!existUser) {
        throw new Error(`Administrador no encontrado`);
    }

    return true;
}
