// Library
import { DataTypes } from "sequelize";

class ProjectLikes {
  constructor(server) {
    const table = server.model.db.define('project_likes', {
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
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      tableName: 'project_likes',
      timestamps: false
    });

    this.table = table;
  }
}

export default ProjectLikes;