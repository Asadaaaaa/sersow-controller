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
  }
}

export default Settings;