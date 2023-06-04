// Library
import { DataTypes } from "sequelize";

class ProjectTags {
  constructor(server) {
    const table = server.model.db.define('project_tags', {
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
      name: {
        type: DataTypes.STRING(12),
        allowNull: false
      },
      other: {
        type: DataTypes.STRING(15),
        allowNull: true
      }
    }, {
      tableName: 'project_tags',
      timestamps: false
    });

    this.table = table;
  }
}

export default ProjectTags;