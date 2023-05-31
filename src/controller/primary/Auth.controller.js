import ResponsePreset from '../../helpers/ResponsePreset.helper.js';
import AuthValidator from '../../validators/primary/Auth.validator.js';
import AuthService from '../../services/primary/Auth.service.js';

// Library
import Ajv from 'ajv';

class Auth {
  constructor(server) {
    this.server = server;

    this.ResponsePreset = new ResponsePreset();
    this.Ajv = new Ajv();
    this.DataScheme = new AuthValidator();
    this.AuthService = new AuthService(this.server);
  }

  async register(req, res) {
    const schemeValidate = this.Ajv.compile(this.DataScheme.register);
    
    if(!schemeValidate(req.body)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      schemeValidate.errors[0].message,
      'validator',
      schemeValidate.errors[0]
    ));
    
    const { emailUpi, name, gender, password } = req.body;
    const resRegister = await this.AuthService.register(emailUpi, name, gender, password);

    if(resRegister === -1) return res.status(403).json(this.ResponsePreset.resErr(
      403,
      'Forbidden, Email Already Verified',
      'service',
      { code: -1 }
    ));
    
    return res.status(200).json(this.ResponsePreset.resOK('OK', { token: resRegister }));
  }

  async resendVerificationCode(req, res) {
    const resSendCode = await this.AuthService.sendVerificationCode(req.middlewares.authorization.userId);

    if(resSendCode === -1) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      'Not Found, User Id Not Exist',
      'service',
      { code: -1 }
    ));

    if(resSendCode === -2) return res.status(403).json(this.ResponsePreset.resErr(
      403,
      'Forbidden, Email already verified',
      'service',
      { code: -2 }
    ));

    if(resSendCode === -3) return res.status(406).json(this.ResponsePreset.resErr(
      406,
      'Not Acceptable, Resend Cooldown not reached 25 seconds yet',
      'service',
      { code: -3 }
    ));

    return res.status(200).json(this.ResponsePreset.resOK(
      'OK',
      null
    ))
  }

  async validationVerificationCode(req, res) {
    const schemeValidate = this.Ajv.compile(this.DataScheme.validCode);

    if(!schemeValidate(req.body)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      schemeValidate.errors[0].message,
      'validator',
      schemeValidate.errors[0]
    ));
    
    const resValidation = await this.AuthService.validationVerificationCode(req.middlewares.authorization.userId, req.body.code);
    
    if(resValidation === -1) return res.status(403).json(this.ResponsePreset.resErr(
      403,
      'Forbidden, Verification Code is Wrong',
      'service',
      { code: -1 }
    ));

    if(resValidation === -2) return res.status(403).json(this.ResponsePreset.resErr(
      403,
      'Forbidden, Verification Code is Expired',
      'service',
      { code: -2 }
    ));

    return res.status(200).json(this.ResponsePreset.resOK('OK', resValidation))
  }

  async login(req, res) {
    const schemeValidate = this.Ajv.compile(this.DataScheme.login);
    if(!schemeValidate(req.body)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      schemeValidate.errors[0].message,
      'validator',
      schemeValidate.errors[0]
    ));
    
    const { identity, password } = req.body;
    const resLogin = await this.AuthService.login(identity, password);

    if(resLogin === -1) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      'Not Found, Identity or Password is wrong',
      'service',
      { code: -1 }
    ));

    return res.status(200).json(this.ResponsePreset.resOK('OK', resLogin))
  }

  async refreshToken(req, res) {
    const tokenData = req.middlewares.authorization;
    const { refreshToken } = req.query;
    const getRefreshTokenSrv = await this.AuthService.refreshToken(tokenData, refreshToken);
    
    if(getRefreshTokenSrv === -1) return res.status(403).json(this.ResponsePreset.resErr(
      401,
      'Refresh Token Unauthorized',
      'service',
      { code: -1 }
    ));

    if(getRefreshTokenSrv === -2) return res.status(403).json(this.ResponsePreset.resErr(
      401,
      'Refresh Token Id Not Same',
      'service',
      { code: -2 }
    ));

    if(getRefreshTokenSrv === -3) return res.status(403).json(this.ResponsePreset.resErr(
      401,
      'Refresh Token User Id Not Same',
      'service',
      { code: -3 }
    ));

    return res.status(200).json(this.ResponsePreset.resOK('OK', getRefreshTokenSrv));
  }

  async reqForgetPassword(req, res) {
    const schemeValidate = this.Ajv.compile(this.DataScheme.reqForgetPassword);
    if(!schemeValidate(req.body)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      schemeValidate.errors[0].message,
      'validator',
      schemeValidate.errors[0]
    ));
    
    this.AuthService.reqForgetPassword(req.body.email);

    return res.status(200).json(this.ResponsePreset.resOK(
      "OK, If your email matches an existing account we will send a password reset email within a few minutes. If you have not received an email check your spam folder or resend"
      , null));
  }

  async newForgetPassword(req, res) {
    const schemeValidate = this.Ajv.compile(this.DataScheme.newForgetPassword);
    if(!schemeValidate(req.body)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      schemeValidate.errors[0].message,
      'validator',
      schemeValidate.errors[0]
    ));

    const { code, password } = req.body;
    const resNewPass = await this.AuthService.newForgetPassword(code, password);

    if(resNewPass === -1) return res.status(403).json(this.ResponsePreset.resErr(
      403,
      'Forbidded, Code is wrong',
      'service',
      { code: -1 }
    ));

    return res.status(200).json(this.ResponsePreset.resOK('OK', null));
  }
}

export default Auth;