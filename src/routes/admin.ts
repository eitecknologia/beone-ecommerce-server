import { Router } from "express";
import { fieldsValidate } from '../middlewares.ts/validate-fields';
import { loginAdmin } from '../controller/auth';
import { validateJwt } from '../helpers/validate-jwt';

const adminRouter: Router = Router();

/* Service to get logged Info */
adminRouter.get('/my_info', [
    validateJwt,
    fieldsValidate
], loginAdmin)

export default adminRouter;