import Primary from "./Primary.js";
import ProfileController from "../../controller/primary/Profiile.controller.js";

class Profile extends Primary {
  constructor(server) {
    super(server);

    this.endpointPrefix = this.endpointPrefix + '/profile'
    this.ProfileController = new ProfileController(this.server);

    this.routes();
  }

  routes() {
    // Update
    this.API.patch(this.endpointPrefix + '/update', this.AuthorizationMiddleware.check(), (req, res) => this.ProfileController.updateProfile(req, res));
    this.API.put(this.endpointPrefix + "/link", this.AuthorizationMiddleware.check(), (req, res) => this.ProfileController.addBioLink());
    // this.API.patch(this.endpointPrefix + '/update/username', this.AuthorizationMiddleware.check(), (req, res) => this.);

    // Get
  }
}

export default Profile;