import { DataTypes } from "sequelize";
import { sequelize } from "../util/database";

const UserDetailModel = sequelize.define("UserDetails", {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  isBuyer: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  isSeller: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  cityName: {
    type: DataTypes.STRING,
  },
  provinceName: {
    type: DataTypes.STRING,
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  govtIdUrl: {
    type: DataTypes.STRING(4000),
    allowNull: true,
  },
});

export const UserDetail = UserDetailModel;
