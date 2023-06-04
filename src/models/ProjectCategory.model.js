// Library
import { DataTypes } from "sequelize";

class ProjectCategory {
  constructor(server) {
    const table = server.model.db.define('project_category', {
      id: {
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      project_id: {
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      category_id: {
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      other: {
        type: DataTypes.STRING(15),
        allowNull: true
      }
    }, {
      tableName: 'project_category',
      timestamps: false
    });

    this.table = table;
  }
}

export default ProjectCategory;