import UserModel from "../../models/User.model.js";
import FollowingModel from "../../models/Following.model.js";
import FollowCounterModel from "../../models/FollowCounter.model.js";
import ProjectModel from "../../models/Project.model.js";
import UserRank from "../../models/UserRank.model.js";

// Library
import { Op } from "sequelize";
import { fileTypeFromBuffer } from 'file-type';
import FS from 'fs-extra';

class Profile {
  constructor(server) {
    this.server = server;

    this.UserModel = new UserModel(this.server).table;
    this.FollowingModel = new FollowingModel(this.server).table;
    this.FollowCounterModel = new FollowCounterModel(this.server).table;
    this.ProjectModel = new ProjectModel(this.server).table;
    this.UserRank = new UserRank(this.server).table;
  }

  async updateProfile(userId, name, bio, image, website) {
    const userModelData = await this.UserModel.findOne({ where: { id: userId } });
    
    if(userModelData === null) return -1;
    
    let imagePath = userModelData.dataValues.image_path;
    
    if(image !== undefined) {
      if(image !== null) {
        const file = Buffer.from(image, 'base64');
        const fileType = await fileTypeFromBuffer(file);
        if(!fileType) return -2;
        
        if (!(fileType && (fileType.ext === 'jpeg' || fileType.ext === 'jpg' || fileType.ext === 'png'))) return -2;
        if(file.byteLength > 1048576) return -3;
  
        imagePath = '/server_data/profile_image/' + userId + '.' + fileType.ext;
        
        this.server.FS.writeFileSync(process.cwd() + imagePath, file);
      } else {
        const defaultImageNumber = Math.floor(Math.random() * 10) + 1;
        imagePath = '/server_data/resources/default_profile_image/' + defaultImageNumber + '.png';
      }
    }

    await this.UserModel.update({
      name,
      bio,
      ...(image !== undefined ? {image_path: imagePath} : {}),
      website
    }, {
      where: {
        id: userId
      }
    });

    return 1;
  }

  async getProfile(username, userId) {
    const getDataUserModel = await this.UserModel.findOne({
      where: { username, verif_email_upi: true },
      attributes: [
        'id',
        'username',
        'name',
        'gender',
        'email_upi',
        'email_gmail',
        'verif_email_gmail',
        ['image_path', 'image'],
        'bio',
        'website',
        'createdAt'
      ]
    });

    if(getDataUserModel === null) return -1;

    const getDataProjectMdel = await this.ProjectModel.findAll({
      where: {
        user_id: getDataUserModel.dataValues.id
      }
    });

    const newData = getDataUserModel.get({ plain: true });

    const getDataFollowCounterModel = await this.FollowCounterModel.findOne({ where: { user_id: newData.id } });

    if(newData.verif_email_gmail === false) {
      delete newData.verif_email_gmail;
      newData.email_gmail = null;
    }

    if(newData.image) newData.image = '/profile/get/photo/' + newData.id;
    
    newData.createdAt = new Date(newData.createdAt).getTime();
    newData.total_following = getDataFollowCounterModel.dataValues.total_following;
    newData.total_follower = getDataFollowCounterModel.dataValues.total_follower;
    newData.total_project = getDataProjectMdel.length;
    newData.isMyProfile = userId === newData.id ? true : false;
    newData.isFollowed = false;

    if(userId) {
      const getDataFollowingModel = await this.FollowingModel.findOne({
        where: {
          user_id: userId,
          follow_user_id: getDataUserModel.dataValues.id
        }
      });

      newData.isFollowed = getDataFollowingModel ? true : false;
    }

    return newData;
  }

  async getPhotoProfile(userId) {
    const getDataUserModel = await this.UserModel.findOne({
      where: { id: userId }
    });

    if(getDataUserModel === null) return -1;
    if(getDataUserModel.dataValues.image_path === null) return -2;

    const file = FS.readFileSync(process.cwd() + getDataUserModel.dataValues.image_path);
    const { mime } = await fileTypeFromBuffer(file);

    return {
      file, mime
    };
  }

  async searchProfile(username, limit) {
    const getDataUserModel = await this.UserModel.findAll({
      where: {
        username: {
          [Op.substring]:  `%${username}%`
        }
      },
      order: [
        [this.server.model.db.literal(`LOCATE('${username}', username)`)], // Sort by similarity
      ],
      limit,
      attributes: [
        'id',
        'username',
        'name',
        ['image_path', 'image']
      ]
    });

    const newData = getDataUserModel.map(val => {
      val.dataValues.image = '/profile/get/photo/' + val.dataValues.id;
      return val.dataValues;
    });

    return newData;
  }

  async getTrendsUsers(userId) {
    const getDataUserRankModel = await this.UserRank.findAll({
      attributes: [
        ['user_id', 'id'],
        'username',
        'name'
      ]
    });

    for(let i in getDataUserRankModel) {
      getDataUserRankModel[i].dataValues.image = '/profile/get/photo/' + getDataUserRankModel[i].dataValues.id;
      getDataUserRankModel[i].dataValues.isFollowed = false;
      getDataUserRankModel[i].dataValues.isMyProfile = getDataUserRankModel[i].dataValues.id === userId ? true : false;

      if(userId) {
        const getDataFollowingModel = await this.FollowingModel.findOne({
          where: {
            user_id: userId,
            follow_user_id: getDataUserRankModel[i].dataValues.id
          }
        });
  
        if(getDataFollowingModel !== null) getDataUserRankModel[i].dataValues.isFollowed = true;
      }
      
    }

    return getDataUserRankModel;
  }
}

export default Profile;