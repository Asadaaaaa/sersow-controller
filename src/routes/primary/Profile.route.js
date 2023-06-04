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
    // Get 
    this.API.get(this.endpointPrefix + '/get/:username', (req, res) => this.ProfileController.getProfile(req, res));
    this.API.get(this.endpointPrefix + '/get/photo/:userId', (req, res) => this.ProfileController.getPhotoProfile(req, res));
  }
}

export default Profile;