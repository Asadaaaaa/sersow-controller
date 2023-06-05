import ResponsePreset from '../../helpers/ResponsePreset.helper.js';
import ProjectValidator from '../../validators/primary/Project.validator.js';
import ProjectService from '../../services/primary/Project.service.js';

// Library
import Ajv from 'ajv';

class ProjectController {

  constructor(server) {
    this.server = server;

    this.ResponsePreset = new ResponsePreset();
    this.Ajv = new Ajv();
    this.DataScheme = new ProjectValidator();
    this.ProjectService = new ProjectService(this.server);
  }

  // --- Draft Project
  async draftProject(req, res) {
    const schemeValidate = this.Ajv.compile(this.DataScheme.project);

    if(!schemeValidate(req.body)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      schemeValidate.errors[0].message,
      'validator',
      schemeValidate.errors[0]
    ));

    const getDraftProjectSrv = await this.ProjectService.draftProject(req.body);

    return res.status(200).json(this.ResponsePreset.resOK(
      'OK',
      null
    ));
  }

  async getCategoryProject(req, res) {
    const getCategoryProjectSrv = await this.ProjectService.getCategoryProject();
    
    return res.status(200).json(this.ResponsePreset.resOK(
      'OK',
      getCategoryProjectSrv
    ));
  }
}

export default ProjectController;