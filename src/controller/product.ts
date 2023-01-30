import { Request, Response } from "express";
import { deleteFiles } from "../helpers/files";
import { Product, ProductImages } from "../models";

/* Register product Function */
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { categoryid } = req.body;

        /* Get the body data */
        const { description, weigth, width, mts, moq, deliverytime, fobusd, certificates, notes, stock }: Product = req.body;
        const imagesArray: ProductImages[] = req.body.images || [];

        const product = await Product.create({
            description,
            weigth,
            fobusd,
            width,
            mts,
            moq,
            deliverytime,
            certificates,
            notes,
            stock,
            categoryid: +categoryid
        })

        for (const { url } of imagesArray) {
            await ProductImages.create({
                productid: product.productid,
                url
            })
        }

        return res.status(201).json({
            ok: true,
            msg: "Producto Creado"
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}

/* Get a product by id Function */
export const findProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const reward = await Product.findOne({
            attributes: { exclude: ['isactive', 'timecreated', 'categoryid'] },
            where: { isactive: true, productid: id },
            include: [
                {
                    model: ProductImages,
                    as: 'images',
                    attributes: ['url']
                }
            ]
        });

        return res.status(200).json({
            ok: true,
            msg: "Producto encontrado",
            reward
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}

/* Update product Function */
export const updateProduct = async (req: Request, res: Response) => {
    try {

        const { productid } = req.params;
        /* Get the body data */
        const { description, weigth, width, mts, moq, deliverytime, fobusd, certificates, notes, stock }: Product = req.body;
        const imagesArray: ProductImages[] = req.body.images || [];

        await Product.update({
            description,
            weigth,
            fobusd,
            width,
            mts,
            moq,
            deliverytime,
            certificates,
            notes,
            stock,
        }, { where: { productid } })

        /* Verify if exist new images to update */
        if (imagesArray.length > 0) {
            await ProductImages.destroy({ where: { productid } });
            for (const { url } of imagesArray) {
                await ProductImages.create({
                    url,
                    productid: +productid
                })
            }
        }

        return res.status(201).json({
            ok: true,
            msg: "Producto Actualizado"
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}

/* Delete Product Function */
export const deleteProduct = async (req: Request, res: Response) => {
    try {

        const { productid } = req.params;

        /* Get the images Reward Images */
        const images: ProductImages[] = await ProductImages.findAll({ where: { productid } }) || [];

        /* Delete the image from cloudinary */
        for (const { url } of images) {
            await deleteFiles(url);
        }

        /* Delete the url images from the DB */
        await ProductImages.destroy({ where: { productid } });

        await Product.update({
            isactive: false
        }, { where: { productid } });

        return res.status(200).json({
            ok: true,
            msg: "Producto Eliminado"
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}