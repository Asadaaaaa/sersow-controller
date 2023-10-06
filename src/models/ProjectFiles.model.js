// Library
import { DataTypes } from "sequelize";

class ProjectFiles {
  constructor(server) {
    const table = server.model.db.define('project_files', {
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
      type: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      method: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      tableName: 'project_files',
      timestamps: false
    });

    this.table = table;
  }
}

export default ProjectFiles;