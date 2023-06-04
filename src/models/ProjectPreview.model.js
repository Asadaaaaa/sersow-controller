// Library
import { DataTypes } from "sequelize";

class ProjectPreview {
  constructor(server) {
    const table = server.model.db.define('project_preview', {
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
      sort: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      path: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      tableName: 'project_preview',
      timestamps: false
    });

    this.table = table;
  }
}

export default ProjectPreview;