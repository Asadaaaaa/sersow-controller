import Primary from "./Primary.js";
import ProfileController from "../../controller/primary/Profiile.controller.js";

class Profile extends Primary {
  constructor(server) {
    super(server);

    this.endpointPrefix = this.endpointPrefix + '/profile'
    this.ProfileController = new ProfileController(this.server);
  }

  routes() {
    // Update
    this.API.patch(this.endpointPrefix + '/update', this.AuthorizationMiddleware.check(), (req, res) => this.ProfileController.updateProfile(req, res));
    this.API.patch(this.endpointPrefix + '/update/username');

    // Get
  }
}

export default Profile;