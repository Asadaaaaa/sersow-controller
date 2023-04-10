// Library
import { Sequelize } from "sequelize";

class Handler{
  constructor(server) {
    this.server = server;
  }

  async connect() {
    this.server.sendLogs('Connecting to database...');
    try{
      this.db = new Sequelize({
        host: this.server.env.DB_HOST,
        port: this.server.env.DB_PORT,
        username: this.server.env.DB_USERNAME,
        password: this.server.env.DB_PASSWORD,
        database: this.server.env.DB_DATABASE,
        dialect: this.server.env.DB_DIALECT,
        logging: this.server.env.DB_LOGGING === 'false' ? false : true
      });
      await this.db.authenticate();
    } catch(err) {
      this.server.sendLogs(err);
      return -1;
    }

    this.server.sendLogs('Database Connected');

    return this.db;
  }


}

export default Handler;
