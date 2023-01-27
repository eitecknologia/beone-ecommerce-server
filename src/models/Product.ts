import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../database/config';
import ProductImages from './ProductImage';

interface Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
    rewardid: CreationOptional<number>;
    description: CreationOptional<string>;
    weigth: CreationOptional<string>;
    width: CreationOptional<string>;
    mts: CreationOptional<number>;
    moq: CreationOptional<string>;
    deliverytime: CreationOptional<number>;
    fobusd: number;
    certificates: CreationOptional<string>;
    notes: CreationOptional<string>;
    stock: CreationOptional<number | null>;
    isactive: CreationOptional<boolean>;
    timecreated: CreationOptional<Date>;
    categoryid: number;
}


const Product = sequelize.define<Product>('beone_products', {
    rewardid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    isactive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    timecreated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    categoryid: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

Product.hasMany(ProductImages, {
    foreignKey: 'rewardid',
    sourceKey: 'rewardid',
    as: 'images'
});

ProductImages.belongsTo(Product, {
    foreignKey: 'rewardid',
    as: 'image'
});

export default Product;
