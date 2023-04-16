import ResponsePreset from '../helpers/ResponsePreset.helper.js';

// Library
import JWT from "jsonwebtoken";

class Authorization {
  constructor(server) {
    this.server = server;
    this.ResponsePreset = new ResponsePreset();
  }

  check() {
    return (req, res, next) => {
      const token = req.headers['authorization'];
      if(!token) return res.status(401).json({
        status: 401,
        message: 'Request Unauthorized'
      });
      
      JWT.verify(token, this.server.env.JWT_TOKEN_SECRET, (err, data) => {
        if(err) return res.status(401).json(this.ResponsePreset.resErr(
          401,
          'Token Unauthorized',
          'token',
          { code: -1 }
        ));

        if(req.originalUrl.endsWith('valid-code') || req.originalUrl.endsWith('resend-code')) {
          if(data.notVerified !== true) return res.status(401).json(this.ResponsePreset.resErr(
            401,
            'User in Token is Already Verified',
            'token',
            { code: -2 }
          ));
        }

        if(!(req.originalUrl.endsWith('valid-code') || req.originalUrl.endsWith('resend-code'))) {
          if(data.notVerified === true) return res.status(401).json(this.ResponsePreset.resErr(
            401,
            'User in Token is Not Verified',
            'token',
            { code: -3 }
          ));
        }

        req.middlewares.authorization = data;

        next();
      });
    }
  }

}

export default Authorization;