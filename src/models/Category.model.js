// Library
import { DataTypes } from "sequelize";

class Category {
  constructor(server) {
    const table = server.model.db.define('category', {
      id: {
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false
      }
    }, {
      tableName: 'category',
      timestamps: false
    });

    this.table = table;
  }
}

export default Category;