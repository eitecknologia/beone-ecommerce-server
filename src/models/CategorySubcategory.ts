import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../database/config';

interface CategorySubcategory extends Model<InferAttributes<CategorySubcategory>, InferCreationAttributes<CategorySubcategory>> {
    casub: CreationOptional<number>;
    categoryid: number;
    subcategoryid: number;
    timecreated: CreationOptional<Date>;
}

const CategorySubcategory = sequelize.define<CategorySubcategory>('beone_categories_subcategories', {
    casub: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    categoryid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subcategoryid: {
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

export default CategorySubcategory;