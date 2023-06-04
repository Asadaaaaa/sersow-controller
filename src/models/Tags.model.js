// Library
import { DataTypes } from "sequelize";

class Tags {
  constructor(server) {
    const table = server.model.db.define('tag_counter_view', {
      name: DataTypes.STRING(12),
      counter: DataTypes.BIGINT(21),
      rank: DataTypes.BIGINT(21)
    }, {
      tableName: 'tag_counter_view',
      timestamps: false
    });
    table.removeAttribute('id');

    this.table = table;
  }
}

export default Tags;