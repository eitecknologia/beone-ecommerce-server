import { Request, Response } from "express";
import Subcategory from '../models/Subcategory';
import Category from '../models/Category';
import { CategorySubcategory } from "../models";
import { Op } from 'sequelize';

/* Register subcategories Function */
export const createSubcategory = async (req: Request, res: Response) => {
    try {
        /* Get the body data */
        const { name, description }: Subcategory = req.body;

        await Subcategory.create({
            name: name.toUpperCase(),
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

/* Get all subcategories Function */
export const getSubcategories = async (req: Request, res: Response) => {
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

        const { casub } = req.params;

        await CategorySubcategory.destroy({ where: { casub } })

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