import Primary from './Primary.js';
import Auth from '../../controller/primary/Auth.controller.js';
import AuthorizationMiddleware from '../../middlewares/Authorization.middleware.js';

class Authentication extends Primary {
  constructor(server) {
    super(server);

    this.endpointPrefix = this.endpointPrefix + '/auth';
    this.Auth = new Auth(this.server);
    this.AuthorizationMiddleware = new AuthorizationMiddleware(this.server);

    this.routes();
  }

  routes() {
    this.API.post(this.endpointPrefix + '/register', (req, res) => this.Auth.register(req, res));
    this.API.post(this.endpointPrefix + '/valid-code', this.AuthorizationMiddleware.check(), (req, res) => this.Auth.validationVerificationCode(req, res));
    this.API.post(this.endpointPrefix + '/resend-code', this.AuthorizationMiddleware.check(), (req, res) => this.Auth.resendVerificationCode(req, res));
    this.API.post(this.endpointPrefix + '/login', (req, res) => this.Auth.login(req,res));
    this.API.post(this.endpointPrefix + '/req-forget-password');
  }
}

export default Authentication;
