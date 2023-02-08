import { Request, Response } from "express";
import { deleteFiles } from "../helpers/files";
import { Product, ProductImages, SubcategoryProducts } from "../models";
import Subcategory from '../models/Subcategory';
import { Op } from 'sequelize';
import { validatePaginateParams, infoPaginate } from '../helpers/pagination';

/* Register product Function */
export const createProduct = async (req: Request, res: Response) => {
    try {

        /* Get the body data */
        const { name, description, weigth, width, mts, moq, deliverytime, fobusd, certificates, notes, stock }: Product = req.body;
        const imagesArray: ProductImages[] = req.body.images || [];

        const subcategoriesIdsArray: Subcategory[] = req.body.subcategories || [];

        const product = await Product.create({
            name,
            description,
            weigth,
            fobusd,
            width,
            mts,
            moq,
            deliverytime,
            certificates,
            notes,
            stock
        })

        for (const { subcategoryid } of subcategoriesIdsArray) {
            await SubcategoryProducts.create({ subcategoryid, productid: product.productid })
        }

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

/* Get all products Function */
export const getAllProducts = async (req: Request, res: Response) => {
    try {

        const { page, size } = req.query;
        const { offset, limit, pageSend, sizeSend } = await validatePaginateParams(page, size);

        const { count: total, rows: products } = await Product.findAndCountAll({
            attributes: ['productid', 'name', 'description', 'timecreated'],
            include: [{
                model: ProductImages,
                as: 'images',
                attributes: ['url']
            }],
            where: { isactive: true },
            order: [['timecreated', 'DESC']],
            offset: (offset - sizeSend),
            limit
        })

        /* Calculate the total of pages */
        const totalPages = (Math.ceil(total / limit));
        const info = await infoPaginate(totalPages, total, pageSend, sizeSend);

        return res.status(201).json({
            ok: true,
            msg: "Listado de productos",
            info,
            products
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
        const { name, description, weigth, width, mts, moq, deliverytime, fobusd, certificates, notes, stock }: Product = req.body;
        const imagesArray: ProductImages[] = req.body.images || [];

        const subcategoriesIdsArray: SubcategoryProducts[] = req.body.subcategories || [];

        await Product.update({
            name,
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

        /* Product to add in subcategories */
        if (subcategoriesIdsArray.length > 0) {
            for (const { subcategoryid } of subcategoriesIdsArray) {
                const existRegister = await SubcategoryProducts.findOne({ where: { productid, subcategoryid } })
                if (!existRegister) {
                    await SubcategoryProducts.create({ productid: +productid, subcategoryid })
                }
            }
        }

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

/* Get availability of subcategories of a product Function */
export const availabilitySubcategories = async (req: Request, res: Response) => {
    try {

        const { productid } = req.params;

        const subcategoriesWithProduct = await SubcategoryProducts.findAll({
            attributes: { exclude: ['productid', 'subcategoryid', 'timecreated'] },
            include: [{
                model: Subcategory,
                attributes: { exclude: ['isactive', 'timecreated'] },
                as: 'subcategory_products'
            }],
            where: { productid }
        })

        const categoriesWithProductsIds = subcategoriesWithProduct.map((register: any) => register.subcategory_products.subcategoryid);

        const subcategoriesAvailables = await Subcategory.findAll({
            attributes: ['subcategoryid', 'name', 'description'],
            where: {
                subcategoryid: { [Op.notIn]: categoriesWithProductsIds },
                isactive: true
            },
            order: [['timecreated', 'DESC']]
        })

        return res.status(201).json({
            ok: true,
            msg: "Disponibilidad de productos en subcategorías",
            subcategoriesWithProduct,
            subcategoriesAvailables
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}

/* Delete Product of subcategory Function */
export const deleteProductOfSubcategory = async (req: Request, res: Response) => {
    try {

        const { subprodid } = req.params;

        await SubcategoryProducts.destroy({ where: { subprodid } });

        return res.status(200).json({
            ok: true,
            msg: "Producto eliminado de subcategoría",
            subprodid
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