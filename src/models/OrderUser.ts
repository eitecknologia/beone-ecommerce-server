import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../database/config';

interface OrderUsers extends Model<InferAttributes<OrderUsers>, InferCreationAttributes<OrderUsers>> {
    orderuserid: CreationOptional<number>;
    orderid: number;
    userid: number;
    timecreated: CreationOptional<Date>;
}

const OrderUsers = sequelize.define<OrderUsers>('beone_order_user', {
    orderuserid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userid: {
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

export default OrderUsers;