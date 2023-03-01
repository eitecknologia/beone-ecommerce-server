import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../database/config';

interface OrderProducts extends Model<InferAttributes<OrderProducts>, InferCreationAttributes<OrderProducts>> {
    orderprodid: CreationOptional<number>;
    orderid: number;
    productid: number;
    state: string;
    timecreated: CreationOptional<Date>;
}

const OrderProducts = sequelize.define<OrderProducts>('beone_order_products', {
    orderprodid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    state:{
        type: DataTypes.STRING(50),
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

export default OrderProducts;