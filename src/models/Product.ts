import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../database/config';
import ProductImages from './ProductImage';

interface Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
    rewardid: CreationOptional<number>;
    name: string;
    description: CreationOptional<string>;
    isactive: CreationOptional<boolean>;
    timecreated: CreationOptional<Date>;
    stock: CreationOptional<number | null>
    categoryid: number;
}


const Product = sequelize.define<Product>('beone_products', {
    rewardid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(1000),
        allowNull: true
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
