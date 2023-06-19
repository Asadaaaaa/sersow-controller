// Library
import { DataTypes } from "sequelize";

class Project {
  constructor(server) {
    const table = server.model.db.define('project', {
      id: {
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING(25),
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(700),
        allowNull: true
      },
      logo_path: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      published: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      published_datetime: {
        type: DataTypes.DATE,
        allowNull: false
      },
      flag_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      flag_takedown: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    }, {
      tableName: 'project',
      timestamps: false
    });

    this.table = table;
  }
}

export default Project;