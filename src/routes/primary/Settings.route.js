import Primary from "./Primary.js";
import SettingsController from "../../controller/primary/Settings.controller.js";

class Settings extends Primary {
  constructor(server) {
    super(server);

    this.endpointPrefix = this.endpointPrefix + '/settings'
    this.SettingsController = new SettingsController(this.server);
    this.routes();
  }

  routes() {
    // Update
    this.API.patch(this.endpointPrefix + '/account/username', this.AuthorizationMiddleware.check(), (req, res) => this.SettingsController.accountUpdateUsername(req, res));

    // Get

    //Add Gmail
    this.API.post(this.endpointPrefix + '/account/gmail/add', this.AuthorizationMiddleware.check(), (req,res) => this.SettingsController.accountAddEmail(req,res));

    //Valid Code
    this.API.post(this.endpointPrefix + '/account/gmail/valid-code', this.AuthorizationMiddleware.check(), (req,res) => this.SettingsController.validationGmailCode(req,res));

    // Resend Code
    this.API.post(this.endpointPrefix + '/account/gmail/resend-code', this.AuthorizationMiddleware.check(), (req,res) => this.SettingsController.resendVerificationCode(req,res));
  }
}

export default Settings;