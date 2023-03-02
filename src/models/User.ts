import { DataTypes, InferCreationAttributes, InferAttributes, Model, CreationOptional } from 'sequelize';
import sequelize from '../database/config';
import OrderUsers from './OrderUser';
import UserCart from './UserCart';

interface User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    userid: CreationOptional<number>;
    name: string;
    lastname: string;
    ci: string;
    address: string;
    email: string;
    password: string;
    phone: CreationOptional<string>;
    google: CreationOptional<boolean>;
    facebook: CreationOptional<boolean>;
    isactive: CreationOptional<boolean | null>;
    timecreated: CreationOptional<Date>;
    roleid: number;
}

const User = sequelize.define<User>('beone_users', {
    userid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ci: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    isactive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null
    },
    google: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    facebook: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    timecreated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    roleid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: process.env.USER_ID
    }
}, {
    timestamps: false
});

/* Relation with OrderUsers */
User.hasMany(OrderUsers, {
    foreignKey: "userid",
    sourceKey: "userid"
})

OrderUsers.belongsTo(User, {
    foreignKey: "userid"
})

/* Relation with UserCart */
User.hasMany(UserCart, {
    foreignKey: "userid",
    sourceKey: "userid"
})

UserCart.belongsTo(User, {
    foreignKey: "userid"
})

export default User;