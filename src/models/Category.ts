import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../database/config';
import Product from './Product';

interface Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
    categoryid: CreationOptional<number>;
    name: string;
    description: CreationOptional<string>;
    isactive: CreationOptional<boolean>;
    timecreated: CreationOptional<Date>;
}

const Category = sequelize.define<Category>('beone_categories', {
    categoryid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
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
}, {
    timestamps: false
});

/* Relation with Products one to many */
Category.hasMany(Product, {
    foreignKey: "categoryid",
    sourceKey: "categoryid",
    as: 'categories'
})

Product.belongsTo(Category, {
    foreignKey: 'categoryid',
    as: 'category'
})


export default Category;