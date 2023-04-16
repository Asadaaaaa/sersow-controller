import ResponsePreset from '../../helpers/ResponsePreset.helper.js';
import ProfileValidator from '../../validators/primary/Profile.validator.js';
import ProfileService from '../../services/primary/Profile.service.js';

// Library
import Ajv from 'ajv';

class Profile {

  constructor(server) {
    this.server = server;

    this.ResponsePreset = new ResponsePreset();
    this.Ajv = new Ajv();
    this.ProfileValidator = new ProfileValidator();
    this.ProfileService = new ProfileService(this.server);
  }

  // --- Update Profile

  updateProfile(req, res) {
    const schemeValidate = this.Ajv.compile(this.ProfileValidator.updateProfile);
    
    if(!schemeValidate(req.body)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      schemeValidate.errors[0].message,
      'validator',
      schemeValidate.errors[0]
    ));
    
    const { userId } = req.middlewares.authorization;
    const { name, username, bio, image } = req.body;
    const resUpdateProfile = this.ProfileService.updateProfile(userId, name, username, bio, image);

    if(resUpdateProfile === -1) return res.status(403).json(this.ResponsePreset.resErr(
      403,
      'Forbidden',
      'service',
      { code: -1 }
    ));

  }

}

export default Profile;