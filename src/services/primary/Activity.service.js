import UserModel from "../../models/User.model.js";
import FollowingModel from "../../models/Following.model.js";

class ActivityService {
  constructor(server) {
    this.server = server;

    this.UserModel = new UserModel(this.server).table;
    this.FollowingModel = new FollowingModel(this.server).table;
  }

  // Follow Fungtion Service
  async follow(userId, followUserId) {
    const getDataUserModel = await this.UserModel.findOne({
      where: { id: followUserId },
      attributes: [
        'id'
      ]
    });

    if(getDataUserModel === null) return -1;

    this.FollowingModel.create({ user_id: userId, follow_user_id: followUserId });

    return 1;
  }

  // Unfollow Function Service
  async unfollow(userId, followUserId) {
    const getDataUserModel = await this.UserModel.findOne({
      where: { id: followUserId },
      attributes: [
        'id'
      ]
    });

    if(getDataUserModel === null) return -1;

    this.FollowingModel.destroy({
      where: { user_id: userId, follow_user_id: followUserId }
    });

    return 1;
  }
}

export default ActivityService;