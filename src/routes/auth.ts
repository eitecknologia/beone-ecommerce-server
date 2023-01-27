import { Router } from "express";
import { check } from "express-validator";
import { fieldsValidate } from '../middlewares.ts/validate-fields';
import { registerAdmin, loginAdmin } from '../controller/auth';

const authRouter: Router = Router();

/* Service to create the admin user */
authRouter.post('/register_admin', [
    check('ci', 'El CI es obligatorio').notEmpty().isNumeric().isLength({ min: 10 }),
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('lastname', 'El apellido es obligatorio').notEmpty(),
    check('city', 'La ciudad es obligatoria').notEmpty(),
    check('province', 'La provincia es obligatoria').notEmpty(),
    check('email', 'Ingrese un correo válido').isEmail(),
    fieldsValidate
], registerAdmin);

/* Service to Login an Admin */
authRouter.post('/login_admin', [
    check('email', 'Ingrese un correo válido').isEmail(),
    check('password', 'Ingrese la contraseña').notEmpty(),
    fieldsValidate
], loginAdmin)

export default authRouter;