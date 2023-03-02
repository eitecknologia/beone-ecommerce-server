import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../database/config';
import ProductImages from './ProductImage';
import SubcategoryProducts from './SubcategoryProduct';
import OrderProducts from './OrderProducts';
import UserCart from './UserCart';
import ProductColors from './ProductColor';

interface Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
    productid: CreationOptional<number>;
    name: string;
    description: string;
    weigth: CreationOptional<string>;
    width: CreationOptional<string>;
    mts: CreationOptional<number>;
    moq: CreationOptional<string>;
    deliverytime: CreationOptional<number>;
    fobusd: number;
    certificates: CreationOptional<string>;
    notes: CreationOptional<string>;
    stock: CreationOptional<number>;
    discount: CreationOptional<number>;
    isactive: CreationOptional<boolean>;
    timecreated: CreationOptional<Date>;
}


const Product = sequelize.define<Product>('beone_products', {
    productid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(1000),
        allowNull: false,
    },
    weigth: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null
    },
    width: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null
    },
    mts: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: null
    },
    moq: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null
    },
    deliverytime: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null
    },
    fobusd: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    certificates: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null
    },
    notes: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    discount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    isactive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    timecreated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
});

/* Relation with SubcategoryProduct table */
Product.hasMany(SubcategoryProducts, {
    foreignKey: 'productid',
    sourceKey: 'productid',
    as: 'products_subcategories'
});

SubcategoryProducts.belongsTo(Product, {
    foreignKey: 'productid',
    as: 'product_subcategory'
});

/* Relation with productImages table */
Product.hasMany(ProductImages, {
    foreignKey: 'productid',
    sourceKey: 'productid',
    as: 'images'
});

ProductImages.belongsTo(Product, {
    foreignKey: 'productid',
    as: 'image'
});

/* Relation with productcolors table */
Product.hasMany(ProductColors, {
    foreignKey: 'productid',
    sourceKey: 'productid',
    as: 'colors'
});

ProductColors.belongsTo(Product, {
    foreignKey: 'productid',
    as: 'color'
});

/* Relation with OrderProducts */
Product.hasMany(OrderProducts, {
    foreignKey: "productid",
    sourceKey: "productid"
})

OrderProducts.belongsTo(Product, {
    foreignKey: "productid"
})

/* Relation with UserCart */
Product.hasMany(UserCart, {
    foreignKey: "productid",
    sourceKey: "productid",
    as: "products_cart"
})

UserCart.belongsTo(Product, {
    foreignKey: "productid",
    as: "product_cart"
})


export default Product;
