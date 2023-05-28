import UserModel from "../../models/User.model.js";

// Library
import { fileTypeFromBuffer } from 'file-type';

class Profile {
  constructor(server) {
    this.server = server;

    this.UserModel = new UserModel(this.server);
  }

  async updateProfile(userId, name, username, bio, image) {
    const userModelData = await this.UserModel.findOne({ id: userId });
    
    if(userModelData === null) return -1;
    
    let imagePath;
    
    if(image !== null) {
      const file = Buffer.from(image, 'base64');
      const fileType = await fileTypeFromBuffer(file);
      if(!fileType) return -2;
      
      if (!(fileType && (fileType.ext === 'jpeg' || fileType.ext === 'jpg' || fileType.ext === 'png'))) return -2;
      if(file.byteLength > 1048576) return -3;

      imagePath = '/server_data/profile_image/' + userId + '.' + fileType.ext;
      
      this.server.FS.writeFileSync(process.cwd() + imagePath, file);
    }

    await this.UserModel.update({ name, username, bio, image_path: imagePath }, {
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