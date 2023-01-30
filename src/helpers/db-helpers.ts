import { Category, Role, User, Product } from "../models";

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

/* Verify if exist category id */
export const verifyCategoryId = async (id: number) => {
    /* Search if the category exists */
    const existCategory = await Category.findOne({ where: { categoryid: id, isactive: true } });
    if (!existCategory) {
        throw new Error(`Categoria no encontrada`);
    }

    return true;
}

/* Verify if exist category id */
export const verifyProductId = async (id: number) => {
    /* Search if the product exists */
    const existProduct = await Product.findOne({ where: { productid: id, isactive: true } });
    if (!existProduct) {
        throw new Error(`Producto no encontrado`);
    }

    return true;
}