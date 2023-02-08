import { Router } from "express";
import { check } from 'express-validator';

import { isAdminRole } from "../middlewares.ts/roles-validate";
import { fieldsValidate } from "../middlewares.ts/validate-fields";
import { validateJwt } from '../helpers/validate-jwt';
import { availabilitySubcategories, createProduct, deleteProduct, deleteProductOfSubcategory, findProductById, updateProduct, getAllProducts } from '../controller/product';
import { verifyProductId, verifysubCategoryId, verifyRegisterOfProductInSubcategory } from '../helpers/db-helpers';

const productRouter: Router = Router();

/* Service - Register a product */
productRouter.post('/create', [
    validateJwt,
    isAdminRole,
    check('subcategories', 'Las subcategorías debe ser una lista no vacía').optional().isArray().notEmpty(),
    check('subcategories.*.subcategoryid').custom(verifysubCategoryId),
    check('name', 'El nombre es obligatorio').notEmpty().trim(),
    check('description', 'La descripción es obligatoria').notEmpty().trim(),
    check('weigth', 'El peso es obligatorio').optional().notEmpty().trim(),
    check('width', 'El ancho es obligatorio').optional().notEmpty().trim(),
    check('mts', 'El mts/kg es requerido').optional().notEmpty().trim(),
    check('moq', 'La cantidad mínima de pedido es requerida').optional().notEmpty().trim(),
    check('deliverytime', 'El tiempo de entrega es requerida').optional().notEmpty().trim(),
    check('fobusd', 'El valor de la mercancía puesta a bordo es requerido').optional().notEmpty().trim(),
    check('certificates', 'El certificado es requerido').optional().notEmpty().trim(),
    check('notes', 'Los apuntes son requeridos').optional().notEmpty().trim(),
    check('stock', 'El stock es requerido').optional().notEmpty().trim(),
    check('images', 'Las imágenes debe ser una lista no vacía').optional().isArray().notEmpty(),
    check('images.*.url', 'El url de la imagen es obligatorio').trim().isURL(),
    fieldsValidate
], createProduct);

/* Service - Get all products */
productRouter.get('/get_all', [
    validateJwt,
    isAdminRole,
    fieldsValidate
], getAllProducts);

/* Service - Get product by id */
productRouter.get('/get_by_id/:id', [
    validateJwt,
    isAdminRole,
    check('id', 'Formato de id incorrecto').isNumeric(),
    check('id').custom(verifyProductId),
    fieldsValidate
], findProductById);

/* Service - Update a product */
productRouter.put('/update/:productid', [
    validateJwt,
    isAdminRole,
    check('productid', 'Formato de id incorrecto').isNumeric(),
    check('productid').custom(verifyProductId),
    check('name', 'El nombre es obligatorio').optional().notEmpty().trim(),
    check('description', 'La descripción es obligatoria').optional().notEmpty().trim(),
    check('weigth', 'El peso es obligatorio').optional().notEmpty().trim(),
    check('width', 'El ancho es obligatorio').optional().notEmpty().trim(),
    check('mts', 'El mts/kg es requerido').optional().notEmpty().trim(),
    check('moq', 'La cantidad mínima de pedido es requerida').optional().notEmpty().trim(),
    check('deliverytime', 'El tiempo de entrega es requerida').optional().notEmpty().trim(),
    check('fobusd', 'El valor de la mercancía puesta a bordo es requerido').notEmpty().trim(),
    check('certificates', 'El certificado es requerido').optional().notEmpty().trim(),
    check('notes', 'Los apuntes son requeridos').optional().notEmpty().trim(),
    check('stock', 'El stock es requerido').optional().notEmpty().trim(),
    check('images', 'Las imágenes debe ser una lista no vacía').optional().isArray().notEmpty(),
    check('images.*.url', 'El url de la imagen es obligatorio').trim().isURL(),
    check('subcategories', 'Las subcategorías debe ser una lista no vacía').optional().isArray().notEmpty(),
    check('subcategories.*.subcategoryid').custom(verifysubCategoryId),
    fieldsValidate
], updateProduct);

productRouter.get('/get_availability_subcategories/:productid', [
    validateJwt,
    isAdminRole,
    check('productid', 'Formato de id incorrecto').isNumeric(),
    check('productid').custom(verifyProductId),
    fieldsValidate
], availabilitySubcategories);

/* Service - Delete Reward by id */
productRouter.delete('/delete_of_subcategory/:subprodid', [
    validateJwt,
    isAdminRole,
    check('subprodid', 'Formato de id incorrecto').notEmpty().isNumeric(),
    check('subprodid').custom(verifyRegisterOfProductInSubcategory),
    fieldsValidate
], deleteProductOfSubcategory);

/* Service - Delete product by id */
productRouter.delete('/delete/:productid', [
    validateJwt,
    isAdminRole,
    check('productid', 'Formato de id incorrecto').notEmpty().isNumeric(),
    check('productid').custom(verifyProductId),
    fieldsValidate
], deleteProduct);


export default productRouter;
