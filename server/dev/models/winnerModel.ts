import { DataTypes } from "sequelize";
import { sequelize } from "../util/database";

const Winner = sequelize.define("winner", {
  firstName: {
    field: "firstName",
    type: DataTypes.STRING,
  },
  lastName: {
    field: "lastName",
    type: DataTypes.STRING,
  },

  email: {
    field: "email",
    type: DataTypes.STRING,
  },
  userId: {
    field: "userId",
    type: DataTypes.INTEGER,
  },
  bidAmount: {
    field: "bidAmount",
    type: DataTypes.INTEGER,
  },
});

export const winnerModel = Winner;
