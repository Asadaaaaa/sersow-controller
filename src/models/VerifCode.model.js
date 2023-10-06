// Library
import { DataTypes } from "sequelize";

class VerifCode {
  constructor(server) {
    const table = server.model.db.define('verif_code', {
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
        type: DataTypes.STRING(6),
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      tableName: 'verif_code',
      timestamps: false
    });

    this.table = table;
  }
}

export default VerifCode;