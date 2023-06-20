import Primary from "./Primary.js";
import ProjectController from "../../controller/primary/Project.controller.js";

class ProjectRoute extends Primary {
  constructor(server) {
    super(server);

    this.endpointPrefix = this.endpointPrefix + '/project'
    this.ProjectController = new ProjectController(this.server);

    this.routes();
  }

  routes() {
    // --- Draft Project
    this.API.put(this.endpointPrefix + '/draft', this.AuthorizationMiddleware.check(), (req, res) => this.ProjectController.draftProject(req, res));

    // --- Publish Project
    this.API.post(this.endpointPrefix + '/publish', this.AuthorizationMiddleware.check(), (req, res) => this.ProjectController.publishProject(req, res));

    // --- Delete Project
    this.API.delete(this.endpointPrefix + '/delete/:projectId', this.AuthorizationMiddleware.check(), (req, res) => this.ProjectController.deleteProject(req, res));

    // -- Get Category Project
    this.API.get(this.endpointPrefix + '/get/category', (req, res) => this.ProjectController.getCategoryProject(req, res));

    this.API.get(this.endpointPrefix + '/get/manage/:projectId', this.AuthorizationMiddleware.check(), (req, res) => this.ProjectController.getManageProject(req, res));
    this.API.get(this.endpointPrefix + '/get/details/:projectId', this.AuthorizationMiddleware.check(), (req, res) => this.ProjectController.getDetails(req, res));
    this.API.get(this.endpointPrefix + '/get/logo/:projectId', (req, res) => this.ProjectController.getLogo(req, res));
    this.API.get(this.endpointPrefix + '/get/thumbnail/:projectId', (req, res) => this.ProjectController.getThumbnail(req, res));
    this.API.get(this.endpointPrefix + '/get/preview/:sort/:projectId', (req, res) => this.ProjectController.getPreviewImage(req, res));
    this.API.get(this.endpointPrefix + '/get/files/:type/:projectId', (req, res) => this.ProjectController.getFiles(req, res));
    
    this.API.get(this.endpointPrefix + '/get/user/:targetUserId', this.AuthorizationMiddleware.check(), (req, res) => this.ProjectController.getUserProject(req, res));
    this.API.get(this.endpointPrefix + '/get/my/draft', this.AuthorizationMiddleware.check(), (req, res) => this.ProjectController.getMyDraft(req, res));
    this.API.get(this.endpointPrefix + '/get/collabs/:targetUserId', this.AuthorizationMiddleware.check(), (req, res) => this.ProjectController.getUserCollabs(req, res));

    this.API.get(this.endpointPrefix + '/get/foryou', this.AuthorizationMiddleware.check(), (req, res) => this.ProjectController.getForYou(req, res));
    this.API.get(this.endpointPrefix + '/trends/project', this.AuthorizationMiddleware.check(), (req, res) => this.ProjectController.getProjectTrends(req, res));

    this.API.get(this.endpointPrefix + '/search/title/:title', this.AuthorizationMiddleware.check(), (req, res) => this.ProjectController.searchProject(req, res));
  }
}

export default ProjectRoute;