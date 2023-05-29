import UserModel from "../../models/User.model.js";

// Library
import { fileTypeFromBuffer } from 'file-type';

class Profile {
  constructor(server) {
    this.server = server;

    this.UserModel = new UserModel(this.server).table;
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
        imagePath = null;
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

  async updateUsername(userId, username) {
    // const userModelData = this.UserModel.findOne
  }
}

export default Profile;