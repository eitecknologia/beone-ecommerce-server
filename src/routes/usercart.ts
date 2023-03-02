import { Router } from "express";
import { fieldsValidate } from '../middlewares.ts/validate-fields';
import { addToCart, myCartInfo } from '../controller/usercart';
import { isUserRole } from '../middlewares.ts/roles-validate';
import { validateJwt } from '../helpers/validate-jwt';
import { check } from 'express-validator';
import { verifyStockProduct } from '../helpers/db-helpers';

const usercartRouter: Router = Router();

usercartRouter.post('/add_to_cart', [
    validateJwt,
    isUserRole,
    check('amount', 'La cantidad debe ser un valor numérico').notEmpty().isNumeric(),
    check('productid').custom((amount, req) => verifyStockProduct(amount, req)),
    fieldsValidate
], addToCart);

usercartRouter.get('/my_cart', [
    validateJwt,
    isUserRole,
    fieldsValidate
],myCartInfo);

export default usercartRouter;