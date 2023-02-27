import { Router } from "express";
import { check } from "express-validator";
import { fieldsValidate } from '../middlewares.ts/validate-fields';
import { registerAdmin, loginAdmin, loginGoogle, loginFacebook, loginUser, registerUser, recoverPassword, recoverPasswordReset } from '../controller/auth';

const authRouter: Router = Router();

/* Service to create the admin user */
authRouter.post('/register_admin', [
    check('ci', 'El CI es obligatorio').notEmpty().isNumeric().isLength({ min: 10 }),
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('lastname', 'El apellido es obligatorio').notEmpty(),
    check('address', 'La dirección es obligatoria').notEmpty(),
    check('email', 'Ingrese un correo válido').isEmail(),
    fieldsValidate
], registerAdmin);

/* Service to Login an Admin */
authRouter.post('/login_admin', [
    check('email', 'Ingrese un correo válido').isEmail(),
    check('password', 'Ingrese la contraseña').notEmpty(),
    fieldsValidate
], loginAdmin)

/* Service to create an user */
authRouter.post('/register_user', [
    check('ci', 'El CI es obligatorio').notEmpty().isNumeric().isLength({ min: 10 }),
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('lastname', 'El apellido es obligatorio').notEmpty(),
    check('address', 'La dirección es obligatoria').notEmpty(),
    check('email', 'Ingrese un correo válido').isEmail(),
    check('password', 'La contraseña debe tener al menos seis caracteres').trim().notEmpty().isLength({ min: 6 }),
    fieldsValidate
], registerUser);

/* Service to Login an Admin */
authRouter.post('/login_user', [
    check('email', 'Ingrese un correo válido').isEmail(),
    check('password', 'Ingrese la contraseña').notEmpty(),
    fieldsValidate
], loginUser)

/* Login with google */
authRouter.post('/login_google', [
    check('accessToken', 'El accessToken es obligatorio').trim().notEmpty(),
    fieldsValidate
], loginGoogle);

/* Login with facoock */
authRouter.post('/login_facebook', [
    check('accessToken', 'El accessToken es obligatorio').trim().notEmpty(),
    fieldsValidate
], loginFacebook);

authRouter.post('/reset_password_send', [
    check('email', 'Ingrese un correo válido').isEmail(),
    fieldsValidate
], recoverPassword);

/* Service - Set new password */
authRouter.post('/reset_password', [
    check('userid', 'Id de usuario Obligatorio').notEmpty(),
    check('token', 'Token Obligatorio').notEmpty(),
    check('password', 'El password debe contener al menos 6 caracteres').isLength({ min: 6 }),
    fieldsValidate
], recoverPasswordReset);

export default authRouter;