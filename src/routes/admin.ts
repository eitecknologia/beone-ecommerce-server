import { Router } from "express";
import { check } from 'express-validator';

import { validateJwt } from '../helpers/validate-jwt';
import { isAdminRole } from '../middlewares.ts/roles-validate';
import { fieldsValidate } from '../middlewares.ts/validate-fields';
import { verifyAdminId } from '../helpers/db-helpers';
import { deleteAdmin, findAdminById, getAllAdmins, updateAdmin } from '../controller/admin';

const adminRouter: Router = Router();

/* Service - Get All Admins */
adminRouter.get('/get_all', [
    validateJwt,
    isAdminRole,
    fieldsValidate
], getAllAdmins);

/* Service to get logged Info */
adminRouter.get('/get_by_id/:id', [
    validateJwt,
    isAdminRole,
    check('id').custom(verifyAdminId),
    fieldsValidate
], findAdminById);

/* Service - Update an Admin Logged */
adminRouter.put('/update', [
    validateJwt,
    isAdminRole,
    check('ci', 'El CI es obligatorio').optional().notEmpty().isNumeric().isLength({ min: 10 }),
    check('name', 'El nombre es obligatorio').optional().notEmpty(),
    check('lastname', 'El apellido es obligatorio').optional().notEmpty(),
    check('province', 'La provincia es obligatoria').optional().notEmpty(),
    check('city', 'La ciudad es obligatoria').optional().notEmpty(),
    check('email', 'Ingrese un correo válido').optional().isEmail(),
    check('password', 'El password debe contener al menos 6 caracteres').optional().isLength({ min: 6 }),
    fieldsValidate
], updateAdmin);

/* Service - Delete Admin by id */
adminRouter.delete('/delete/:id', [
    validateJwt,
    isAdminRole,
    check('id', 'Formato de id incorrecto').isNumeric(),
    check('id').custom(verifyAdminId),
    fieldsValidate
], deleteAdmin);

export default adminRouter;