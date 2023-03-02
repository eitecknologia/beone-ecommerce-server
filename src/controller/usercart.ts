import { Request, Response } from "express";
import { Product, UserCart } from "../models";

/* Add product to cart Function */
export const addToCart = async (req: Request, res: Response) => {
    try {

        /* Get the user id of token */
        const { userid } = req.user;

        /* Get the cart info of body */
        const { amount, productid } = req.body;

        const productUser = await UserCart.findOne({ where: { productid, userid } })

        if (productUser) {
            const newAmount = (amount > 0) ? amount : 1;
            await productUser.increment('amount', { by: newAmount })
        } else {
            await UserCart.create({
                userid,
                productid,
                ...(amount > 0) ? { amount } : {}
            })
        }

        return res.status(200).json({
            ok: true,
            msg: "Agregado al carrito"
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}


/* Get info of cart of user logged Function */
export const myCartInfo = async (req: Request, res: Response) => {
    try {
        /* Get the user id of token */
        const { userid } = req.user;

        /* Get the products of user in the cart */
        const cart = await UserCart.findAll({
            attributes: ["usercartid", "amount"],
            include: [{
                model: Product,
                as: "product_cart",
                attributes: ["productid", "name", "description", "fobusd"],
                where: { isactive: true }
            }],
            where: { userid }
        });

        let total = 0;
        cart.forEach((cart: any) => {
            const fobusd = cart.dataValues.product_cart.fobusd;
            const amount = cart.dataValues.amount;
            total = +(total + (amount * fobusd)).toFixed(2)
        })

        return res.status(200).json({
            ok: true,
            msg: "Información del carrito",
            total,
            cart
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}