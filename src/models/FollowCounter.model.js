// Library
import { DataTypes } from "sequelize";

class FollowCounter {
  constructor(server) {
    const table = server.model.db.define('follow_counter', {
      user_id: DataTypes.STRING(36),
      total_following: DataTypes.INTEGER(21),
      total_follower: DataTypes.INTEGER(21)
    }, {
      tableName: 'follow_counter',
      timestamps: false
    });
    table.removeAttribute('id');

    this.table = table;
  }
}

export default FollowCounter;