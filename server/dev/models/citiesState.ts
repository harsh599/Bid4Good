import { DataTypes } from "sequelize";
import { sequelize } from "../util/database";

const cityProvinceModel = sequelize.define(
  "canadacities",
  {
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city_ascii: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    province_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    province_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lng: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    population: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    density: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ranking: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export const cityProvince = cityProvinceModel;
