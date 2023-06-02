import UserModel from "../../models/User.model.js";

class SettingsService {
  constructor(server) {
    this.server = server;

    this.UserModel = new UserModel(this.server).table;
  }

  async accountUpdateUsername(userId, username) {
    const getDataUserModel = await this.UserModel.findOne({
      where: { id: userId },
      attributes: [
        'id',
        'username',
      ],
    });

    if(getDataUserModel === null) return -1;
    if(getDataUserModel.dataValues.username === username) return -2;

    await this.UserModel.update({ username }, { where: { id: userId } });

    return 1;
  }

  async addEmail(userId, email) {
    const getDataUserModel = await this.UserModel.findOne({
      where: { id: userId },
      attributes: [
        'id',
        'email_gmail',
      ],
    });

    if(getDataUserModel === null) return -1;
    if(getDataUserModel.dataValues.email_gmail && getDataUserModel.dataValues.verif_email_gmail === true) return -2;

    await this.UserModel.update({ email_gmail }, { where: { id: userId } });

    return 1;
  }
}

export default SettingsService;