import { DataTypes, InferAttributes, Model, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../database/config';

interface ProductImages extends Model<InferAttributes<ProductImages>, InferCreationAttributes<ProductImages>> {
    imageid: CreationOptional<number>;
    url: string;
    productid: number;
}

const ProductImages = sequelize.define<ProductImages>('beone_product_images', {
    imageid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productid: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

export default ProductImages;
