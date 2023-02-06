import { Router } from "express";
import { check } from 'express-validator';

import { isAdminRole } from "../middlewares.ts/roles-validate";
import { fieldsValidate } from "../middlewares.ts/validate-fields";
import { createCategory, getCategories, findCategoryById, updateCategory, deleteCategory } from '../controller/category';
import { validateJwt } from '../helpers/validate-jwt';
import { verifyCategoryId } from "../helpers/db-helpers";

const categoryRouter: Router = Router();

/* Service - Register a category */
categoryRouter.post('/create', [
    validateJwt,
    isAdminRole,
    check('name', 'El nombre es obligatorio').trim().notEmpty(),
    check('description', 'La descripción es obligatoria').optional().trim().notEmpty(),
    fieldsValidate
], createCategory);

/* Service - Get all Categories */
categoryRouter.get('/get_all', [
    validateJwt,
    isAdminRole,
    fieldsValidate
], getCategories);

/* Service - Get Category by id */
categoryRouter.get('/get_by_id/:id', [
    validateJwt,
    isAdminRole,
    check('id', 'Formato de id incorrecto').isNumeric(),
    check('id').custom(verifyCategoryId),
    fieldsValidate
], findCategoryById);

/* Service - Update a Category */
categoryRouter.put('/update/:id', [
    validateJwt,
    isAdminRole,
    check('id', 'Formato de id incorrecto').isNumeric(),
    check('id').custom(verifyCategoryId),
    check('name', 'El nombre es obligatorio').optional().trim().notEmpty(),
    check('description', 'La descripción es obligatoria').optional().trim().notEmpty(),
    fieldsValidate
], updateCategory);

/* Service - Delete category by id */
categoryRouter.delete('/delete/:id', [
    validateJwt,
    isAdminRole,
    check('id', 'Formato de id incorrecto').isNumeric(),
    check('id').custom(verifyCategoryId),
    fieldsValidate
], deleteCategory);

export default categoryRouter;
