import { Request, Response } from "express";
import Subcategory from '../models/Subcategory';
import Category from '../models/Category';
import { CategorySubcategory, Product, ProductImages, SubcategoryProducts } from "../models";
import { Op } from 'sequelize';
import { validatePaginateParams, infoPaginate } from '../helpers/pagination';

/* Register subcategories Function */
export const createSubcategory = async (req: Request, res: Response) => {
    try {
        /* Get the body data */
        const { name, description }: Subcategory = req.body;

        await Subcategory.create({
            name: name,
            description
        })

        return res.status(201).json({
            ok: true,
            msg: "Subcategoria Creada"
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}

/* Update subcategory Function */
export const updateSubcategory = async (req: Request, res: Response) => {
    try {

        let { name, description } = req.body;
        const { id } = req.params;

        await Subcategory.update({ name, description }, { where: { subcategoryid: id } });

        return res.status(200).json({
            ok: true,
            msg: "Subcategoría Actualizada"
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}

/* Get all subcategories availables and used Function */
export const getSubcategoriesAvailability = async (req: Request, res: Response) => {
    try {

        const categoryid = req.params.categoryid;

        const subcategoriesInCategory = await CategorySubcategory.findAll({
            attributes: { exclude: ['categoryid', 'subcategoryid', 'timecreated'] },
            include: [{
                model: Subcategory,
                attributes: { exclude: ['isactive', 'timecreated'] },
                as: 'subcategory_category'
            }],
            where: { categoryid },
            order: [['timecreated', 'DESC']]
        });

        const subcategoriesInCategoryIds = subcategoriesInCategory.map((subcategory: any) => subcategory.subcategory_category.subcategoryid)

        const subcategoriesAvailables = await Subcategory.findAll({
            attributes: ['subcategoryid', 'name', 'description'],
            where: {
                subcategoryid: { [Op.notIn]: subcategoriesInCategoryIds },
                isactive: true
            },
            order: [['timecreated', 'DESC']]
        })

        return res.status(200).json({
            ok: true,
            msg: "Listado de subcategorias",
            subcategoriesInCategory,
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
/* Get all subcategories Function */
export const getSubcategories = async (_req: Request, res: Response) => {
    try {
        const subcategories = await Subcategory.findAll({
            attributes: ['subcategoryid', 'name', 'description'],
            include: [{
                attributes: ['categoryid'],
                model: CategorySubcategory,
                as: "subcategories_category",
                required: true
            }],
            raw: true,
            where: {
                isactive: true
            },
            order: [['timecreated', 'DESC']]
        })

        const subcategoriesInList: Subcategory[] = [];

        for (const subcategory of subcategories) {
            const existRegister = subcategoriesInList.find(sub => sub.subcategoryid == subcategory.subcategoryid);
            if (!existRegister) {
                subcategoriesInList.push(subcategory)
            }
        }

        return res.status(200).json({
            ok: true,
            msg: "Listado de subcategorias",
            subcategories: subcategoriesInList
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}


/* Assign subcategories into a category Function */
export const assignSubcategories = async (req: Request, res: Response) => {
    try {

        const { categoryid }: Category = req.body;
        const subcategoriesArray: Subcategory[] = req.body.subcategories;

        for (const { subcategoryid } of subcategoriesArray) {
            await CategorySubcategory.create({
                categoryid,
                subcategoryid
            })
        }

        return res.status(200).json({
            ok: true,
            msg: "Subcategorías Asignadas"
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error",
            error
        })
    }
}

/* Delete category of a subcategory Function */
export const deleteDSubcategory = async (req: Request, res: Response) => {
    try {

        const { casubid } = req.params;

        await CategorySubcategory.destroy({ where: { casubid } })

        return res.status(200).json({
            ok: true,
            msg: "Subcategoría Eliminada"
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
        const { page, size } = req.query;
        const { offset, limit, pageSend, sizeSend } = await validatePaginateParams(page, size);

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
            attributes: ['subprodid', 'timecreated'],
            include: [{
                model: Product,
                as: 'product_subcategory',
                attributes: ['productid', 'name', 'description', 'fobusd', 'stock', 'deliverytime', 'discount'],
                include: [{
                    model: ProductImages,
                    as: 'images',
                    attributes: ['url']
                }]
            }],
            where: { subcategoryid },
            order: [['timecreated', 'DESC']],
            offset: (offset - sizeSend),
            limit
        })

        /* Calculate the total of pages */
        const total = await SubcategoryProducts.count({ where: { subcategoryid } })
        const totalPages = (Math.ceil(total / limit));
        const info = await infoPaginate(totalPages, total, pageSend, sizeSend);

        return res.status(200).json({
            ok: true,
            msg: "Listado de productos en subcategoría",
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