import { Router } from "express";
import { validateJwt } from '../helpers/validate-jwt';
import { check } from 'express-validator';
import { isAdminRole } from '../middlewares/roles-validate';
import { fieldsValidate } from '../middlewares/validate-fields';
import { validateFile } from "../middlewares/validate-files";
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
fileRouter.put('/delete', [
    validateJwt,
    isAdminRole,
    check('url', 'Ingrese un url correcto').notEmpty(),
    fieldsValidate
], deleteFile);

export default fileRouter;