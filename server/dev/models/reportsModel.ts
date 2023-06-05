import { DataTypes } from "sequelize";
import { sequelize } from "../util/database";

const ReportModel = sequelize.define("reports", {
  ticketId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  isResolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  issueType: {
    type: DataTypes.ENUM("return", "refund", "cancellation"),
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
});

export const Report = ReportModel;
