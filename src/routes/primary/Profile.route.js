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
    this.API.get(this.endpointPrefix + '/get/:username', this.AuthorizationMiddleware.check(), (req, res) => this.ProfileController.getProfile(req, res));
    this.API.get(this.endpointPrefix + '/get/photo/:userId', (req, res) => this.ProfileController.getPhotoProfile(req, res));
    this.API.get(this.endpointPrefix + '/get/following/:targetUserId', this.AuthorizationMiddleware.check(), (req, res) => this.ProfileController.getFollowingsUser(req, res));
    this.API.get(this.endpointPrefix + '/get/follower/:targetUserId', this.AuthorizationMiddleware.check(), (req, res) => this.ProfileController.getFollowersUser(req, res));
    this.API.get(this.endpointPrefix + '/search/username/:username', this.AuthorizationMiddleware.check(), (req, res) => this.ProfileController.searchProfile(req, res));
    this.API.get(this.endpointPrefix + '/trends/users', this.AuthorizationMiddleware.check(), (req, res) => this.ProfileController.getTrendsUsers(req, res));

    this.API.get(this.endpointPrefix + '/masterminds', (req, res) => this.ProfileController.getMasterminds(req, res));
  }
}

export default Profile;