// Library
import { DataTypes } from "sequelize";

class UserVerified {
  constructor(server) {
    const table = server.model.db.define('user_verified', {
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
      verified_type_id: {
        type: DataTypes.STRING(36),
        allowNull: false
      }
    }, {
      tableName: 'user_verified',
      timestamps: false
    });

    this.table = table;
  }
}

export default UserVerified;