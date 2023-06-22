import UserModel from "../../models/User.model.js";
import FollowingModel from "../../models/Following.model.js";
import FollowCounterModel from "../../models/FollowCounter.model.js";
import ProjectModel from "../../models/Project.model.js";
import UserRank from "../../models/UserRank.model.js";
import VerifiedType from "../../models/VerifiedType.model.js";
import UserVerifiedModel from "../../models/UserVerified.model.js";

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
    this.VerifiedType = new VerifiedType(this.server).table;
    this.UserVerifiedModel = new UserVerifiedModel(this.server).table;
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
      where: {
        username,
        verif_email_upi: true,
        flag_deactivated: false,
        flag_takedown: false
      },
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
        user_id: getDataUserModel.dataValues.id,
        published: true,
        flag_deleted: false,
        flag_takedown: false
      }
    });

    const newData = getDataUserModel.get({ plain: true });

    const getDataFollowCounterModel = await this.FollowCounterModel.findOne({ where: { user_id: newData.id } });

    if(newData.verif_email_gmail === false) {
      delete newData.verif_email_gmail;
      newData.email_gmail = null;
    }

    if(newData.image) newData.image = '/profile/get/photo/' + newData.id;
    
    const getDataUserVerifiedModel = await this.UserVerifiedModel.findOne({
      where: {
        user_id: newData.id
      }
    });

    if(getDataUserVerifiedModel !== null) {
      const getDataVerifiedType = await this.VerifiedType.findOne({
        where: {
          id: getDataUserVerifiedModel.dataValues.verified_type_id
        }
      });

      newData.verified = getDataVerifiedType !== null ? {
        type: getDataVerifiedType.dataValues.type,
        logo: this.server.FS.readFileSync(process.cwd() + getDataVerifiedType.dataValues.logo_path).toString('base64')
      } : null;
    } else newData.verified = null;
    
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
      where: {
        id: userId,
        verif_email_upi: true
      }
    });

    if(getDataUserModel === null) return -1;
    if(getDataUserModel.dataValues.image_path === null) return -2;

    const file = FS.readFileSync(process.cwd() + getDataUserModel.dataValues.image_path);
    const { mime } = await fileTypeFromBuffer(file);

    return {
      file, mime
    };
  }

  async searchProfile(username, limit, userId) {
    const getDataUserModel = await this.UserModel.findAll({
      where: {
        [Op.or]: [
          {
            username: {
              [Op.substring]: `%${username}%`
            }
          },
          {
            name: {
              [Op.substring]: `%${username}%`
            }
          }
        ],
        ...(userId ? {
          id: {
            [Op.ne]: userId
          }
        } : {}),
        verif_email_upi: true,
        flag_deactivated: false,
        flag_takedown: false
      },
      order: [
        [this.server.model.db.literal(`CASE
          WHEN username LIKE '%${username}%' THEN 0
          WHEN name LIKE '%${username}%' THEN 1
          ELSE 2
          END`)],
        [this.server.model.db.literal(`LOCATE('${username}', username)`)]
      ],
      limit,
      attributes: [
        'id',
        'username',
        'name'
      ]
    });
    
    return await this.getListUsersPreview(getDataUserModel, userId);
  }

  async getTrendsUsers(userId) {
    const getDataUserRankModel = await this.UserRank.findAll({
      attributes: [
        ['user_id', 'id'],
        'username',
        'name'
      ]
    });

    return await this.getListUsersPreview(getDataUserRankModel, userId);
  }

  async getFollowingsUser(targetUserId, userId) {
    const getDataUserModel = await this.UserModel.findAll({
      where: {
        id: {
          [Op.in]:  this.server.model.db.literal(`(SELECT follow_user_id FROM following WHERE user_id = "${targetUserId}")`)
        },
        verif_email_upi: true,
        flag_deactivated: false,
        flag_takedown: false
      },
      attributes: [
        'id',
        'username',
        'name'
      ]
    });

    return await this.getListUsersPreview(getDataUserModel, userId);
  }

  async getFollowersUser(targetUserId, userId) {
    const getDataUserModel = await this.UserModel.findAll({
      where: {
        id: {
          [Op.in]:  this.server.model.db.literal(`(SELECT user_id FROM following WHERE follow_user_id = "${targetUserId}")`)
        },
        verif_email_upi: true,
        flag_deactivated: false,
        flag_takedown: false
      },
      attributes: [
        'id',
        'username',
        'name'
      ]
    });

    return await this.getListUsersPreview(getDataUserModel, userId);
  }

  async getListUsersPreview(dataUsersModel, userId) {
    for(let i in dataUsersModel) {
      dataUsersModel[i].dataValues.nameSubstr = dataUsersModel[i].dataValues.name.length > 20 ? dataUsersModel[i].dataValues.name.substring(0, 20) + "..." : dataUsersModel[i].dataValues.name;
      dataUsersModel[i].dataValues.image = '/profile/get/photo/' + dataUsersModel[i].dataValues.id;
      dataUsersModel[i].dataValues.isMyProfile = dataUsersModel[i].dataValues.id === userId ? true : false;
      
      const getDataUserVerifiedModel = await this.UserVerifiedModel.findOne({
        where: {
          user_id: dataUsersModel[i].dataValues.id
        }
      });

      if(getDataUserVerifiedModel !== null) {
        const getDataVerifiedType = await this.VerifiedType.findOne({
          where: {
            id: getDataUserVerifiedModel.dataValues.verified_type_id
          }
        });

        dataUsersModel[i].dataValues.verified = getDataVerifiedType !== null ? {
          type: getDataVerifiedType.dataValues.type,
          logo: this.server.FS.readFileSync(process.cwd() + getDataVerifiedType.dataValues.logo_path).toString('base64')
        } : null;
      } else dataUsersModel[i].dataValues.verified = null;

      if(userId) {
        const getDataFollowingModel = await this.FollowingModel.findOne({
          where: {
            user_id: userId,
            follow_user_id: dataUsersModel[i].dataValues.id
          }
        });
  
        dataUsersModel[i].dataValues.isFollowed = getDataFollowingModel !== null ? true : false;
      } else {
        dataUsersModel[i].dataValues.isFollowed = false;
      }
    }

    return dataUsersModel;
  }

  async getMasterminds() {
    const masterminds = JSON.parse(this.server.FS.readFileSync(process.cwd() + '/server_data/resources/masterminds.json'));
    for(let i in masterminds) {
      const getDataUserModel = await this.UserModel.findOne({
        where: {
          id: masterminds[i].id
        },
        attributes: [
          'username'
        ]
      });

      masterminds[i].username = getDataUserModel !== null ? getDataUserModel.dataValues.username : null;
    }
    
    return masterminds;
  }
}

export default Profile;