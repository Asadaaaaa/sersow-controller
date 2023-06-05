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

    // -- Get Category Project
    this.API.get(this.endpointPrefix + '/get/category', (req, res) => this.ProjectController.getCategoryProject(req, res));
  }
}

export default ProjectRoute;