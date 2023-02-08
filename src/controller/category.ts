import { Request, Response } from "express";
import { Category, Subcategory } from "../models";
import { validatePaginateParams, infoPaginate } from '../helpers/pagination';
import CategorySubcategory from '../models/CategorySubcategory';
import SubcategoryProducts from '../models/SubcategoryProduct';
import Product from '../models/Product';

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
                attributes: { exclude: ['categoryid', 'subcategoryid', 'timecreated'] },
                model: CategorySubcategory,
                as: 'subcategories',
                include: [{
                    model: Subcategory,
                    attributes: { exclude: ['isactive', 'timecreated'] },
                    as: 'subcategory_category'
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

        await Category.update({ name: `${name}`.toUpperCase(), description }, { where: { categoryid: id } });

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

/* Get all categories with each subcategories */
export const getCategoriesWithSubcategories = async (_req: Request, res: Response) => {
    try {

        const categories = await Category.findAll({
            attributes: ['categoryid', 'name', 'description'],
            include: [{
                attributes: ['casubid'],
                model: CategorySubcategory,
                as: 'subcategories',
                include: [{
                    attributes: ['subcategoryid', 'name', 'description'],
                    model: Subcategory,
                    as: 'subcategory_category'
                }]
            }],
            where: { isactive: true },
            order: [['timecreated', 'DESC']],
        })

        return res.status(200).json({
            ok: true,
            msg: "Listado de categorías con subcategorías",
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

/* Get category with products */
export const getSubcategoriesWithProducts = async (req: Request, res: Response) => {
    try {

        let subcategoryid = Number(req.query.subcategoryid) || null;

        if (!subcategoryid) {
            const getlastSubcategoryId = await Subcategory.findOne({
                attributes: ['subcategoryid'],
                order: [['timecreated', 'DESC']]
            })

            if (!getlastSubcategoryId) {
                return res.status(400).json({
                    ok: false,
                    msg: "Por el momento no se encuentra disponible ninguna subcategoría"
                })
            }

            subcategoryid = getlastSubcategoryId.subcategoryid;
        } {
            /* Validate the subcategory */
            const existSubcategory = await Subcategory.findByPk(subcategoryid);
            if (!existSubcategory) {
                return res.status(400).json({
                    ok: false,
                    msg: "Subcategoría no encontrada"
                })
            }
        }

        const products = await SubcategoryProducts.findAll({
            attributes: ['subprodid'],
            include: [{
                model: Product,
                as: 'product_subcategory'
            }],
            where: { subcategoryid },
            order: [['timecreated', 'DESC']]
        })

        return res.status(200).json({
            ok: true,
            msg: "Listado de productos en subcategoría",
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