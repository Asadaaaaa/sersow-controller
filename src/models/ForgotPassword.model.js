// Library
import { DataTypes } from "sequelize";

class ForgotPassword {
  constructor(server) {
    const table = server.model.db.define('forget_password_code', {
      id: {
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.STRING(36),
        allowNull: false
      },
      code: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      tableName: 'forget_password_code',
      timestamps: false
    });

    this.table = table;
  }
}

export default ForgotPassword;