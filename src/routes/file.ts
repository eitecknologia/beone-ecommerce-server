import { Router } from "express";
import { validateJwt } from '../helpers/validate-jwt';
import { check } from 'express-validator';
import { isAdminRole } from '../middlewares.ts/roles-validate';
import { fieldsValidate } from '../middlewares.ts/validate-fields';
import { validateFile } from "../middlewares.ts/validate-files";
import { uploadFile, deleteFile } from '../controller/file';

const fileRouter: Router = Router();

/* Service - Upload a file */
fileRouter.post('/upload', [
    validateJwt,
    isAdminRole,
    validateFile,
    fieldsValidate
], uploadFile);

/* Service - Delete a file */
fileRouter.delete('/delete', [
    validateJwt,
    isAdminRole,
    check('url', 'Ingrese un url correcto').notEmpty(),
    fieldsValidate
], deleteFile);

export default fileRouter;