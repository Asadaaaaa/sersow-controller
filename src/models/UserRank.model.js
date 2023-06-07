// Library
import { DataTypes } from "sequelize";

class UserRank {
  constructor(server) {
    const table = server.model.db.define('user_rank_view', {
      follower_rank: DataTypes.DOUBLE(17.10),
      user_id: DataTypes.STRING(36),
      username: DataTypes.STRING(15),
      name: DataTypes.STRING(60),
      name: DataTypes.TEXT,
    }, {
      tableName: 'user_rank_view',
      timestamps: false
    });
    table.removeAttribute('id');

    this.table = table;
  }
}

export default UserRank;