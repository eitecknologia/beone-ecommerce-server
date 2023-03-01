import { DataTypes, InferCreationAttributes, InferAttributes, Model, CreationOptional } from 'sequelize';
import sequelize from '../database/config';

interface Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
    orderid: CreationOptional<number>;
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


export default Order;