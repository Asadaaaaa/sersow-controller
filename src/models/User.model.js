// Library
import { DataTypes } from "sequelize";

class User{
  constructor(server) {
    const table = server.model.db.define('users', {
      id: {
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING(15),
        allowNull: false
      },
      email_upi: {
        type: DataTypes.STRING(68),
        allowNull: false
      },
      verif_email_upi: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      email_gmail: {
        type: DataTypes.STRING(68),
        allowNull: false
      },
      verif_email_gmail: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      name: {
        type: DataTypes.STRING(60),
        allowNull: false
      },
      gender: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      image_path: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      bio: {
        type: DataTypes.STRING(160),
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      tableName: 'users',
      timestamps: false
    });
    
    this.table = table;
  }
}

export default User;
