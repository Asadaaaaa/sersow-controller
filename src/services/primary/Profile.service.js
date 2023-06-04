import UserModel from "../../models/User.model.js";
import FollowCounterModel from "../../models/FollowCounter.model.js";

// Library
import { fileTypeFromBuffer } from 'file-type';
import FS from 'fs-extra';

class Profile {
  constructor(server) {
    this.server = server;

    this.UserModel = new UserModel(this.server).table;
    this.FollowCounterModel = new FollowCounterModel(this.server).table;
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
        this.server.FS.unlinkSync(process.cwd() + imagePath);

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

  async getProfile(username) {
    const getDataUserModel = await this.UserModel.findOne({
      where: { username },
      attributes: [
        'id',
        'username',
        'name',
        'gender',
        'gender',
        ['image_path', 'image'],
        'bio',
        'website',
        'createdAt'
      ]
    });

    if(getDataUserModel === null) return -1;

    const newData = getDataUserModel.get({ plain: true });

    const getDataFollowCounterModel = await this.FollowCounterModel.findOne({ where: { user_id: newData.id } });

    if(newData.image) newData.image = '/profile/get/photo/' + newData.id;
    newData.createdAt = new Date(newData.createdAt).getTime();
    newData.total_following = getDataFollowCounterModel.dataValues.total_following;
    newData.total_follower = getDataFollowCounterModel.dataValues.total_follower;

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
}

export default Profile;