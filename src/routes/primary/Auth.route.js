import Primary from './Primary.js';
import AuthController from '../../controller/primary/Auth.controller.js';

class Authentication extends Primary {
  constructor(server) {
    super(server);

    this.endpointPrefix = this.endpointPrefix + '/auth';
    this.AuthController = new AuthController(this.server);

    this.routes();
  }

  routes() {
    this.API.post(this.endpointPrefix + '/register', (req, res) => this.AuthController.register(req, res));
    this.API.post(this.endpointPrefix + '/valid-code', this.AuthorizationMiddleware.check(), (req, res) => this.AuthController.validationVerificationCode(req, res));
    this.API.post(this.endpointPrefix + '/resend-code', this.AuthorizationMiddleware.check(), (req, res) => this.AuthController.resendVerificationCode(req, res));
    this.API.post(this.endpointPrefix + '/login', (req, res) => this.AuthController.login(req, res));
    this.API.get(this.endpointPrefix + '/refresh-token', this.AuthorizationMiddleware.check(), (req, res) => this.AuthController.refreshToken(req, res));
    this.API.post(this.endpointPrefix + '/req-forgot-password', (req, res) => this.AuthController.reqForgetPassword(req, res));
    this.API.post(this.endpointPrefix + '/new-forgot-password', (req, res) => this.AuthController.newForgetPassword(req, res));
  }
}

export default Authentication;