import { Request, Response } from "express";
import { Category, Product } from "../models";
import { validatePaginateParams, infoPaginate } from '../helpers/pagination';
import ProductImages from '../models/ProductImage';
import { deleteFiles } from "../helpers/files";

/* Register categories Function */
export const createCategory = async (req: Request, res: Response) => {
    try {

        /* Get the body data */
        const { name, description }: Category = req.body;

        await Category.create({
            name: name.toUpperCase(),
            description
        })

        return res.status(201).json({
            ok: true,
            msg: "Categoria Creada"
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}

/* Get all Categories Function */
export const getCategories = async (req: Request, res: Response) => {
    try {
        const { page, size } = req.query;
        const { offset, limit, pageSend, sizeSend } = await validatePaginateParams(page, size);

        const { count: total, rows: categories } = await Category.findAndCountAll({
            attributes: ['categoryid', 'name', 'description'],
            where: { isactive: true },
            order: [['timecreated', 'DESC']],
            offset: (offset - sizeSend),
            limit
        })

        /* Calculate the total of pages */
        const totalPages = (Math.ceil(total / limit));
        const info = await infoPaginate(totalPages, total, pageSend, sizeSend);

        return res.status(200).json({
            ok: true,
            msg: "Listado de Categorías",
            info,
            categories
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}

/* Get a categories by id Function */
export const findCategoryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const category = await Category.findOne({
            attributes: { exclude: ['isactive', 'timecreated'] },
            include: [{
                model: Product,
                as: 'products',
                attributes: { exclude: ['categoryid', 'timecreated', 'isactive'] },
                include: [{
                    model: ProductImages,
                    as: 'images',
                    attributes: ['url']
                }]
            }],
            where: { isactive: true, categoryid: id }
        });

        return res.status(200).json({
            ok: true,
            msg: "Información de categoría",
            category
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}

/* Update Category Function */
export const updateCategory = async (req: Request, res: Response) => {
    try {

        let { name, description } = req.body;
        const { id } = req.params;

        await Category.update({ name, description }, { where: { categoryid: id } });

        return res.status(200).json({
            ok: true,
            msg: "Categoría Actualizada"
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}

/* Delete Category Function */
export const deleteCategory = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        /* Get all products of the category */
        const productsArray = await Product.findAll({ where: { categoryid: id } });

        /* Delete all images of products of the category */
        for (const { productid } of productsArray) {
            const images: ProductImages[] = await ProductImages.findAll({ where: { productid } }) || [];
            /* Delete the url images from the DB */
            await ProductImages.destroy({ where: { productid } });

            /* Verify if exist at least one image */
            if (images.length > 0) {
                for (const image of images) {
                    /* Delete the image from cloudinary */
                    await deleteFiles(image.url)
                }
            }
        }

        /* Delete all products of the category */
        await Product.update({ isactive: false }, { where: { categoryid: id } });
        /* Delete the category */
        await Category.update({ isactive: false }, { where: { categoryid: id } });

        return res.status(200).json({
            ok: true,
            msg: "Categoria eliminada"
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}
