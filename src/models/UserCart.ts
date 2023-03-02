import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../database/config';

interface UserCart extends Model<InferAttributes<UserCart>, InferCreationAttributes<UserCart>> {
    usercartid: CreationOptional<number>;
    userid: number;
    productid: number;
    amount: CreationOptional<number>;
    timecreated: CreationOptional<Date>;
}

const UserCart = sequelize.define<UserCart>('beone_user_cart', {
    usercartid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
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

export default UserCart;