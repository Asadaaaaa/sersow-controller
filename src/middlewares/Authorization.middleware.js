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
      if(!token) return res.status(401).json(this.ResponsePreset.resErr(
        401,
        'Request Unauthorized',
        'token',
        { code: -1 }
      ));
      
      JWT.verify(token, this.server.env.JWT_TOKEN_SECRET, (err, data) => {
        if(err) {
          if(!err.name === 'TokenExpiredError') return res.status(401).json(this.ResponsePreset.resErr(
            401,
            'Token Unauthorized',
            'token',
            { code: -2 }
          ));
          
          if(!req.path.endsWith('refresh-token')) return res.status(401).json(this.ResponsePreset.resErr(
            401,
            'Token Expired',
            'token',
            { code: -3 }
          ));
          
          data = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'));
        }

        if(req.path.endsWith('/auth/valid-code') || req.path.endsWith('/auth/resend-code')) {
          if(data.notVerified !== true) return res.status(401).json(this.ResponsePreset.resErr(
            401,
            'User in Token is Already Verified',
            'token',
            { code: -4 }
          ));
        }

        if(!(req.path.endsWith('/auth/valid-code') || req.path.endsWith('/auth/resend-code'))) {
          if(data.notVerified === true) return res.status(401).json(this.ResponsePreset.resErr(
            401,
            'User in Token is Not Verified',
            'token',
            { code: -5 }
          ));
        }

        req.middlewares.authorization = data;

        next();
      });
    }
  }

}

export default Authorization;