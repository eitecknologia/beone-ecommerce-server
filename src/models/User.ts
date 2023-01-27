import { DataTypes, InferCreationAttributes, InferAttributes, Model, CreationOptional } from 'sequelize';
import sequelize from '../database/config';

interface User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    userid: CreationOptional<number>;
    name: string;
    ci: string;
    city: string;
    province: string;
    lastname: string;
    email: string;
    password: string;
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
        type: DataTypes.STRING(13),
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
    province: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING(50),
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

export default User;