import { DataTypes, InferAttributes, Model, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../database/config';

interface ProductColors extends Model<InferAttributes<ProductColors>, InferCreationAttributes<ProductColors>> {
    colorid: CreationOptional<number>;
    colorname: string;
    colorcode: string;
    colorhex: string;
    productid: number;
}

const ProductColors = sequelize.define<ProductColors>('beone_product_colors', {
    colorid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    colorname: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    colorcode: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    colorhex: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    productid: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

export default ProductColors;
