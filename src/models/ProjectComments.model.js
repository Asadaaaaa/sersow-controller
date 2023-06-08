// Library
import { DataTypes } from "sequelize";

class ProjectComments {
  constructor(server) {
    const table = server.model.db.define('project_comments', {
      id: {
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      project_id: {
        type: DataTypes.STRING(36),
        allowNull: false
      },
      user_id: {
        type: DataTypes.STRING(36),
        allowNull: false
      },
      comment: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      tableName: 'project_comments',
      timestamps: false
    });

    this.table = table;
  }
}

export default ProjectComments;