// Library
import { DataTypes } from "sequelize";

class VerifiedType {
  constructor(server) {
    const table = server.model.db.define('verified_type', {
      id: {
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      type: {
        type: DataTypes.STRING(25),
        allowNull: false
      },
      logo_path: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, {
      tableName: 'verified_type',
      timestamps: false
    });

    this.table = table;
  }
}

export default VerifiedType;