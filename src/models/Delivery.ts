import { DataTypes, InferCreationAttributes, InferAttributes, Model, CreationOptional } from 'sequelize';
import sequelize from '../database/config';

interface Delivery extends Model<InferAttributes<Delivery>, InferCreationAttributes<Delivery>> {
    deliveryid: CreationOptional<number>;
    city: string;
    street1: string;
    street2: CreationOptional<string>;
    reference: string;
    housenumber: CreationOptional<string>;
    phone: CreationOptional<string>;
    timecreated: CreationOptional<Date>;
}

const Delivery = sequelize.define<Delivery>('beone_delivery_info', {
    deliveryid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    city: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    street1: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    street2: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    reference: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    housenumber: {
        type: DataTypes.STRING(25),
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    timecreated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
})


export default Delivery;