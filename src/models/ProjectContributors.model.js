// Library
import { DataTypes } from "sequelize";

class ProjectContributors {
  constructor(server) {
    const table = server.model.db.define('project_contributors', {
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
      user_id: {
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      }
    }, {
      tableName: 'project_contributors',
      timestamps: false
    });

    this.table = table;
  }
}

export default ProjectContributors;