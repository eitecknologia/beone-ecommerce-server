import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../database/config';

interface SubcategoryProducts extends Model<InferAttributes<SubcategoryProducts>, InferCreationAttributes<SubcategoryProducts>> {
    subprodid: CreationOptional<number>;
    subcategoryid: number;
    productid: number;
    timecreated: CreationOptional<Date>;
}

const SubcategoryProducts = sequelize.define<SubcategoryProducts>('beone_subcategories_products', {
    subprodid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subcategoryid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    timecreated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
}, {
    timestamps: false
});

export default SubcategoryProducts;