// Library
import { DataTypes } from "sequelize";

class ProjectFeatured {
  constructor(server) {
    const table = server.model.db.define('project_featured', {
      project_rank: DataTypes.STRING(17.10),
      project_id: DataTypes.STRING(36),
      user_id: DataTypes.STRING(36),
      title: DataTypes.STRING(25),
      description: DataTypes.STRING(700),
      logo_path: DataTypes.TEXT,
      published_datetime: DataTypes.DATE,
      total_likes: DataTypes.BIGINT(21),
      total_comments: DataTypes.BIGINT(21)
    }, {
      tableName: 'project_featured',
      timestamps: false
    });
    table.removeAttribute('id');

    this.table = table;
  }
}

export default ProjectFeatured;