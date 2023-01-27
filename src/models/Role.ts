import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../database/config';
import User from './User';

interface Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
    roleid: CreationOptional<number>;
    name: string;
}

const Role = sequelize.define<Role>('beone_roles', {
    roleid: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    timestamps: false
});

Role.hasOne(User, {
    foreignKey: "roleid",
    sourceKey: "roleid"
})

User.belongsTo(Role, {
    foreignKey: 'roleid'
})


export default Role;