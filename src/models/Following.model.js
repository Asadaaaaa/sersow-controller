// Library
import { DataTypes } from "sequelize";

class Following {
  constructor(server) {
    const table = server.model.db.define('following', {
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
      follow_user_id: {
        type: DataTypes.STRING(36),
        allowNull: false
      }
    }, {
      tableName: 'following',
      timestamps: false
    });

    this.table = table;
  }
}

export default Following;