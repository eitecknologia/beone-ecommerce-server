import { Router } from "express";
import { fieldsValidate } from '../middlewares.ts/validate-fields';
import { getUserLoggedInfo, updateUser } from '../controller/user';
import { isUserRole } from '../middlewares.ts/roles-validate';
import { validateJwt } from '../helpers/validate-jwt';
import { check } from 'express-validator';

const userRouter: Router = Router();

/* Service - Get All Admins */
userRouter.get('/my_info', [
    validateJwt,
    isUserRole,
    fieldsValidate
], getUserLoggedInfo);

/* Service - Update logged user info */
userRouter.put('/update', [
    validateJwt,
    isUserRole,
    check('ci', 'El CI es obligatorio').optional().notEmpty().isNumeric().isLength({ min: 10 }),
    check('name', 'El nombre es obligatorio').optional().notEmpty(),
    check('lastname', 'El apellido es obligatorio').optional().notEmpty(),
    check('address', 'La provincia es obligatoria').optional().notEmpty(),
    check('email', 'Ingrese un correo válido').optional().isEmail(),
    check('phone', 'El teléfono es obligatorio').optional().notEmpty(),
    check('password', 'El password debe contener al menos 6 caracteres').optional().isLength({ min: 6 }),
    fieldsValidate
], updateUser)


export default userRouter;