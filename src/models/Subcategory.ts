import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../database/config';
import CategorySubcategory from './CategorySubcategory';
import SubcategoryProducts from './SubcategoryProduct';

interface Subcategory extends Model<InferAttributes<Subcategory>, InferCreationAttributes<Subcategory>> {
    subcategoryid: CreationOptional<number>;
    name: string;
    description: CreationOptional<string>;
    isactive: CreationOptional<boolean>;
    timecreated: CreationOptional<Date>;
}

const Subcategory = sequelize.define<Subcategory>('beone_subcategories', {
    subcategoryid: {
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

/* Relation with CategorySubcategory table */
Subcategory.hasMany(CategorySubcategory, {
    foreignKey: "subcategoryid",
    sourceKey: "subcategoryid",
    as: 'subcategories_category'
})

CategorySubcategory.belongsTo(Subcategory, {
    foreignKey: 'subcategoryid',
    as: 'subcategory_category'
})


/* Relation with SucbategoryProduct table */
Subcategory.hasMany(SubcategoryProducts, {
    foreignKey: 'subcategoryid',
    sourceKey: 'subcategoryid',
    as: 'subcategories_products'
});

SubcategoryProducts.belongsTo(Subcategory, {
    foreignKey: 'subcategoryid',
    as: 'subcategory_products'
});


export default Subcategory;