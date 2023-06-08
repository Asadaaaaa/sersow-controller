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
    this.API.post(this.endpointPrefix + '/project/like/:projectId', this.AuthorizationMiddleware.check(), (req, res) => this.ActivityController.likeProject(req, res));
    this.API.post(this.endpointPrefix + '/project/comment/:projectId', this.AuthorizationMiddleware.check(), (req, res) => this.ActivityController.commentProject(req, res));
    
    // Delete
    this.API.delete(this.endpointPrefix + '/user/follow/:userId', this.AuthorizationMiddleware.check(), (req, res) => this.ActivityController.unfollow(req, res));
    this.API.delete(this.endpointPrefix + '/project/like/:projectId', this.AuthorizationMiddleware.check(), (req, res) => this.ActivityController.unlikeProject(req, res));
    this.API.delete(this.endpointPrefix + '/project/comment/:projectId/:commentId', this.AuthorizationMiddleware.check(), (req, res) => this.ActivityController.delCommentProject(req, res))


  }
}

export default Activity;