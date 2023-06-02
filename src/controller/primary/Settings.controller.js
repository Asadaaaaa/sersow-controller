import ResponsePreset from '../../helpers/ResponsePreset.helper.js';
import SettingsValidator from '../../validators/primary/Settings.validator.js';
import SettingsService from '../../services/primary/Settings.service.js';

// Library
import Ajv from 'ajv';

class Settings {

  constructor(server) {
    this.server = server;

    this.ResponsePreset = new ResponsePreset();
    this.Ajv = new Ajv();
    this.SettingsValidator = new SettingsValidator();
    this.SettingsService = new SettingsService(this.server);
  }

  // --- Update Username
  async accountUpdateUsername(req, res) {
    const schemeValidate = this.Ajv.compile(this.SettingsValidator.accountUpdateUsername);
    
    if(!schemeValidate(req.body)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      schemeValidate.errors[0].message,
      'validator',
      schemeValidate.errors[0]
    ));
    
    const { userId } = req.middlewares.authorization;
    const { username } = req.body;

    const getSettingsAccountUpdateUsernameSrv = await this.SettingsService.accountUpdateUsername(userId, username);

    if(getSettingsAccountUpdateUsernameSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      'Not Found, User Id Not Exist',
      'service', 
      { code: -1 }
    ));

    if(getSettingsAccountUpdateUsernameSrv === -2) return res.status(403).json(this.ResponsePreset.resErr(
      403,
      'Forbidden, Username is same like current',
      'service', 
      { code: -2 }
    ));

    return res.status(200).json(this.ResponsePreset.resOK('OK', null));
  }

  // --- Add Email
  async addEmail(req, res) {
    const schemeValidate = this.Ajv.compile(this.SettingsValidator.accountUpdateEmail);
    
    if(!schemeValidate(req.body)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      schemeValidate.errors[0].message,
      'validator',
      schemeValidate.errors[0]
    ));
    
    const { userId } = req.middlewares.authorization;
    const { email } = req.body;
    const getSettingsAccountAddEmail = await this.SettingsService.addEmail(userId,email);

    if(getSettingsAccountAddEmail === -1) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      'Not Found, User Id Not Exist',
      'service', 
      { code: -1 }
    ));

    if(getSettingsAccountAddEmail === -2) return res.status(403).json(this.ResponsePreset.resErr(
      403,
      'Forbidden, Email is already verified',
      'service', 
      { code: -2 }
    ));

    return res.status(200).json(this.ResponsePreset.resOK('OK', null));
  }
}

export default Settings;