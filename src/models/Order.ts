import { DataTypes, InferCreationAttributes, InferAttributes, Model, CreationOptional } from 'sequelize';
import sequelize from '../database/config';
import OrderProducts from './OrderProducts';
import OrderUsers from './OrderUser';
import { orderStatus } from '../common/constants';

interface Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
    orderid: CreationOptional<number>;
    deliveryid: number;
    status: string;
    total: number;
    date: Date;
    payment: string;
    timecreated: CreationOptional<Date>;
}

const Order = sequelize.define<Order>('beone_orders', {
    orderid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    deliveryid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: orderStatus.INGRESADO
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    payment: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    timecreated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
})

/* Relation with OrderProducts */
Order.hasMany(OrderProducts, {
    foreignKey: "orderid",
    sourceKey: "orderid"
})

OrderProducts.belongsTo(Order, {
    foreignKey: "orderid"
})

/* Relation with OrderUsers */
Order.hasMany(OrderUsers, {
    foreignKey: "orderid",
    sourceKey: "orderid"
})

OrderUsers.belongsTo(Order, {
    foreignKey: "orderid"
})



export default Order;