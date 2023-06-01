import Primary from "./Primary.js";
import ActivityController from "../../controller/primary/Activity.controller.js";

class Activity extends Primary {
  constructor(server) {
    super(server);

    this.endpointPrefix = this.endpointPrefix + '/activity'
    this.ActivityController = new ActivityController(this.server);

    this.routes();
  }

  routes() {
    // --- User ---
    // Post
    this.API.post(this.endpointPrefix + '/user/follow/:userId', this.AuthorizationMiddleware.check(), (req, res) => this.ActivityController.follow(req, res));
    // Delete
    this.API.delete(this.endpointPrefix + '/user/follow/:userId', this.AuthorizationMiddleware.check(), (req, res) => this.ActivityController.unfollow(req, res));


  }
}

export default Activity;