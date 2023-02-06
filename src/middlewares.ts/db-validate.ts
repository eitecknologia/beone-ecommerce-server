import { NextFunction, Request, Response } from "express";
import { Category, Subcategory } from "../models";
import CategorySubcategory from '../models/CategorySubcategory';
import { Op } from 'sequelize';

export const validateSubcategoriesInCategory = async (req: Request, res: Response, next: NextFunction) => {

    const { categoryid }: Category = req.body;
    const subcategoriesArray: Subcategory[] = req.body.subcategories;
    const subcategoriesIds = subcategoriesArray.map(subcategory => subcategory.subcategoryid);

    const isSubcategoryRegistered = await CategorySubcategory.findOne({
        where: {
            categoryid,
            subcategoryid: { [Op.in]: subcategoriesIds },
        }
    })

    if (isSubcategoryRegistered) {
        return res.status(400).json({
            ok: false,
            msg: "Una de las subcategorías ya se encuentra asignada a la categoría"
        });
    }

    return next();
}