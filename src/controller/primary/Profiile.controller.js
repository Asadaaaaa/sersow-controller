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
  async updateProfile(req, res) {
    const schemeValidate = this.Ajv.compile(this.ProfileValidator.updateProfile);
    
    if(!schemeValidate(req.body)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      schemeValidate.errors[0].message,
      'validator',
      schemeValidate.errors[0]
    ));
    
    const { userId } = req.middlewares.authorization;
    const { name, bio, image, website } = req.body;
    const resUpdateProfile = await this.ProfileService.updateProfile(userId, name, bio, image, website);

    if(resUpdateProfile === -1) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      'Not Found, User Not Exist',
      'service',
      { code: -1 }
    ));

    if(resUpdateProfile === -2) return res.status(415).json(this.ResponsePreset.resErr(
      415,
      'Unsupported Media Type',
      'service',
      { code: -2 }
    ));

    if(resUpdateProfile === -3) return res.status(403).json(this.ResponsePreset.resErr(
      403,
      'Forbidden, File size is too big',
      'service',
      { code: -3 }
    ));
    
    return res.status(200).json(this.ResponsePreset.resOK('OK', null));
  }

  // --- Get Profile
  async getProfile(req, res) {
    const { username } = req.params;

    if(!username) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      'Bad Request, Username Not Provided',
      'service',
      { code: -1 }
    ));

    const getProfileSrv = await this.ProfileService.getProfile(username);
    if(getProfileSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(404, 'Not Found, User Not Exist', 'service', { code: -2 }));
    
    return res.status(200).json(this.ResponsePreset.resOK('OK', getProfileSrv));
  }

  // --- Get Photo Profile
  async getPhotoProfile(req, res) {
    const { userId } = req.params;
    
    if(!userId) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      'Bad Request, User Id Not Provided',
      'service',
      { code: -1 }
    ));

    const getPhotoProfileSrv = await this.ProfileService.getPhotoProfile(userId);
    
    if(getPhotoProfileSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(404, 'Not Found, User Not Exist', 'service', { code: -2 }));

    res.setHeader('Content-Type', getPhotoProfileSrv.mime);
    return res.status(200).send(getPhotoProfileSrv.file);
  }
}

export default Profile;