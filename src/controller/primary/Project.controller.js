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

  // --- Get Category
  async getCategoryProject(req, res) {
    const getCategoryProjectSrv = await this.ProjectService.getCategoryProject();
    
    return res.status(200).json(this.ResponsePreset.resOK(
      'OK',
      getCategoryProjectSrv
    ));
  }

  // --- Draft Project
  async draftProject(req, res) {
    const { userId } = req.middlewares.authorization;
    const schemeValidate = this.Ajv.compile(this.DataScheme.project);

    if(!schemeValidate(req.body)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      schemeValidate.errors[0].message,
      'validator',
      schemeValidate.errors[0]
    ));

    const getDraftProjectSrv = await this.ProjectService.draftProject(req.body, userId);

    switch(getDraftProjectSrv) {
      case -1: {
        return res.status(404).json(this.ResponsePreset.resErr(
          404,
          'Not Found, Project Not Exist',
          'service',
          { code: -1 }
        ));
      }
      
      case -2: {
        return res.status(403).json(this.ResponsePreset.resErr(
          400,
          'Forbidden, Cannot save draft because project is already published',
          'service',
          { code: -2 }
        ));
      }
      
      case -3: {
        return res.status(404).json(this.ResponsePreset.resErr(
          404,
          'Not Found, Some category not found',
          'service',
          { code: -3 }
        ));
      }
        
      case -4: {
        return res.status(415).json(this.ResponsePreset.resErr(
          415,
          'Unsupported Media Type, Logo File Type Unsupported',
          'service',
          { code: -4 }
        ));
      }
      
      case -5: {
        return res.status(403).json(this.ResponsePreset.resErr(
          403,
          'Forbidden, Logo File size is too big',
          'service',
          { code: -5 }
        ));
      }
        
      case -6: {
        return res.status(415).json(this.ResponsePreset.resErr(
          415,
          'Unsupported Media Type, Thumbnail File Type Unsupported',
          'service',
          { code: -6 }
        ));
      }

      case -7: {
        return res.status(403).json(this.ResponsePreset.resErr(
          403,
          'Forbidden, Thumbnail File size is too big',
          'service',
          { code: -7 }
        ));
      }

      case -8: {
        return res.status(415).json(this.ResponsePreset.resErr(
          415,
          'Unsupported Media Type, Preview 1 File Type Unsupported',
          'service',
          { code: -8 }
        ));
      }
      
      case -9: {
        return res.status(403).json(this.ResponsePreset.resErr(
          403,
          'Forbidden, Preview 1 File size is too big',
          'service',
          { code: -9 }
        ));
      }

      case -10: {
        return res.status(415).json(this.ResponsePreset.resErr(
          415,
          'Unsupported Media Type, Preview 2 File Type Unsupported',
          'service',
          { code: -10 }
        ));
      }
      
      case -11: {
        return res.status(403).json(this.ResponsePreset.resErr(
          403,
          'Forbidden, Preview 2 File size is too big',
          'service',
          { code: -11 }
        ));
      }

      case -12: {
        return res.status(415).json(this.ResponsePreset.resErr(
          415,
          'Unsupported Media Type, Preview 3 File Type Unsupported',
          'service',
          { code: -12 }
        ));
      }

      case -13: {
        return res.status(403).json(this.ResponsePreset.resErr(
          403,
          'Forbidden, Preview 3 File size is too big',
          'service',
          { code: -13 }
        ));
      }

      case -14: {
        return res.status(415).json(this.ResponsePreset.resErr(
          415,
          'Unsupported Media Type, Program File Type Unsupported',
          'service',
          { code: -14 }
        ));
      }

      case -15: {
        return res.status(403).json(this.ResponsePreset.resErr(
          403,
          'Forbidden, Program File size is too big',
          'service',
          { code: -15 }
        ));
      }

      case -16: {
        return res.status(615).json(this.ResponsePreset.resErr(
          415,
          'Unsupported Media Type, Paper File Type Unsupported',
          'service',
          { code: -16 }
        ));
      }

      case -17: {
        return res.status(403).json(this.ResponsePreset.resErr(
          403,
          'Forbidden, Paper File size is too big',
          'service',
          { code: -17 }
        ));
      }

      case -18: {
        return res.status(615).json(this.ResponsePreset.resErr(
          415,
          'Unsupported Media Type, Code File Type Unsupported',
          'service',
          { code: -18 }
        ));
      }

      case -19: {
        return res.status(403).json(this.ResponsePreset.resErr(
          403,
          'Forbidden, Code File size is too big',
          'service',
          { code: -19 }
        ));
      }

      case -20: {
        return res.status(404).json(this.ResponsePreset.resErr(
          404,
          'Forbidden, Some Contributors User Not Found',
          'service',
          { code: -20 }
        ));
      }

      case -500: {
        return res.status(500).json(this.ResponsePreset.resErr(
          500,
          'Server Error, Transaction Error',
          'service',
          { code: -500 }
        ));
      }
    }

    return res.status(200).json(this.ResponsePreset.resOK(
      'OK',
      null
    ));
  }

  // --- Publish Project
  async publishProject(req, res) {
    const { userId } = req.middlewares.authorization;
    const schemeValidate = this.Ajv.compile(this.DataScheme.project);

    if(!schemeValidate(req.body)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      schemeValidate.errors[0].message,
      'validator',
      schemeValidate.errors[0]
    ));

    const getPublishProjectSrv = await this.ProjectService.publishProject(req.body, userId);

    switch(getPublishProjectSrv) {
      case -1: {
        return res.status(404).json(this.ResponsePreset.resErr(
          404,
          'Not Found, Project Not Exist',
          'service',
          { code: -1 }
        ));
      }
      
      case -2: {
        return res.status(403).json(this.ResponsePreset.resErr(
          400,
          'Forbidden, Cannot save draft because project is already published',
          'service',
          { code: -2 }
        ));
      }
      
      case -3: {
        return res.status(404).json(this.ResponsePreset.resErr(
          404,
          'Not Found, Some category not found',
          'service',
          { code: -3 }
        ));
      }
        
      case -4: {
        return res.status(415).json(this.ResponsePreset.resErr(
          415,
          'Unsupported Media Type, Logo File Type Unsupported',
          'service',
          { code: -4 }
        ));
      }
      
      case -5: {
        return res.status(403).json(this.ResponsePreset.resErr(
          403,
          'Forbidden, Logo File size is too big',
          'service',
          { code: -5 }
        ));
      }
        
      case -6: {
        return res.status(415).json(this.ResponsePreset.resErr(
          415,
          'Unsupported Media Type, Thumbnail File Type Unsupported',
          'service',
          { code: -6 }
        ));
      }

      case -7: {
        return res.status(403).json(this.ResponsePreset.resErr(
          403,
          'Forbidden, Thumbnail File size is too big',
          'service',
          { code: -7 }
        ));
      }

      case -8: {
        return res.status(415).json(this.ResponsePreset.resErr(
          415,
          'Unsupported Media Type, Preview 1 File Type Unsupported',
          'service',
          { code: -8 }
        ));
      }
      
      case -9: {
        return res.status(403).json(this.ResponsePreset.resErr(
          403,
          'Forbidden, Preview 1 File size is too big',
          'service',
          { code: -9 }
        ));
      }

      case -10: {
        return res.status(415).json(this.ResponsePreset.resErr(
          415,
          'Unsupported Media Type, Preview 2 File Type Unsupported',
          'service',
          { code: -10 }
        ));
      }
      
      case -11: {
        return res.status(403).json(this.ResponsePreset.resErr(
          403,
          'Forbidden, Preview 2 File size is too big',
          'service',
          { code: -11 }
        ));
      }

      case -12: {
        return res.status(415).json(this.ResponsePreset.resErr(
          415,
          'Unsupported Media Type, Preview 3 File Type Unsupported',
          'service',
          { code: -12 }
        ));
      }

      case -13: {
        return res.status(403).json(this.ResponsePreset.resErr(
          403,
          'Forbidden, Preview 3 File size is too big',
          'service',
          { code: -13 }
        ));
      }

      case -14: {
        return res.status(415).json(this.ResponsePreset.resErr(
          415,
          'Unsupported Media Type, Program File Type Unsupported',
          'service',
          { code: -14 }
        ));
      }

      case -15: {
        return res.status(403).json(this.ResponsePreset.resErr(
          403,
          'Forbidden, Program File size is too big',
          'service',
          { code: -15 }
        ));
      }

      case -16: {
        return res.status(615).json(this.ResponsePreset.resErr(
          415,
          'Unsupported Media Type, Paper File Type Unsupported',
          'service',
          { code: -16 }
        ));
      }

      case -17: {
        return res.status(403).json(this.ResponsePreset.resErr(
          403,
          'Forbidden, Paper File size is too big',
          'service',
          { code: -17 }
        ));
      }

      case -18: {
        return res.status(615).json(this.ResponsePreset.resErr(
          415,
          'Unsupported Media Type, Code File Type Unsupported',
          'service',
          { code: -18 }
        ));
      }

      case -19: {
        return res.status(403).json(this.ResponsePreset.resErr(
          403,
          'Forbidden, Code File size is too big',
          'service',
          { code: -19 }
        ));
      }

      case -20: {
        return res.status(404).json(this.ResponsePreset.resErr(
          404,
          'Forbidden, Some Contributors User Not Found',
          'service',
          { code: -20 }
        ));
      }

      case -500: {
        return res.status(500).json(this.ResponsePreset.resErr(
          500,
          'Server Error, Transaction Error',
          'service',
          { code: -500 }
        ));
      }
    }

    return res.status(200).json(this.ResponsePreset.resOK(
      'OK',
      null
    ));
  }

  async getDetails(req, res) {
    const { projectId } = req.params;
    const { userId } = req.middlewares.authorization;

    const getDetailsSrv = await this.ProjectService.getDetails(projectId, userId);

    if(getDetailsSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      'Not Found, Project Not Found',
      'service',
      { code: -1 }
    ));

    return res.status(200).json(this.ResponsePreset.resOK(
      'OK',
      getDetailsSrv
    ))
  }

  // --- Get Logo Project
  async getLogo(req, res) {
    const { projectId } = req.params;
    
    const getLogoSrv = await this.ProjectService.getLogo(projectId);
    
    if(getLogoSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(404, 'Not Found, Project Not Exist', 'service', { code: -1 }));
    if(getLogoSrv === -2) return res.status(404).json(this.ResponsePreset.resErr(404, 'Not Found, Project Logo Not Exist', 'service', { code: -2 }));

    res.setHeader('Content-Type', getLogoSrv.mime);
    return res.status(200).send(getLogoSrv.file);
  }

  // --- Get Logo Project
  async getThumbnail(req, res) {
    const { projectId } = req.params;
    
    const getThumbnailSrv = await this.ProjectService.getThumbnail(projectId);
    
    if(getThumbnailSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(404, 'Not Found, Project Thumbnail Not Exist', 'service', { code: -1 }));
    if(getThumbnailSrv === -2) return res.status(404).json(this.ResponsePreset.resErr(404, 'Not Found, Project Thumbnail is Using Another Method', 'service', { code: -2 }));

    res.setHeader('Content-Type', getThumbnailSrv.mime);
    return res.status(200).send(getThumbnailSrv.file);
  }

  async getPreviewImage(req, res) {
    const { sort, projectId } = req.params;

    if(isNaN(sort)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      'Bad Request, Sort Must Be a Number',
      'service',
      { code: -1 }
    ));

    const getPreviewImageSrv = await this.ProjectService.getPreviewImage(Number(sort), projectId);

    if(getPreviewImageSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      'Not Found, Image Not Found',
      'service',
      { code: -2 }
    ));

    res.setHeader('Content-Type', getPreviewImageSrv.mime);
    return res.status(200).send(getPreviewImageSrv.file);
  }

  async getFiles(req, res) {
    const { type, projectId } = req.params;
    
    if(isNaN(type)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      'Bad Request, Type Must Be a Number',
      'service',
      { code: -1 }
    ));

    const getFilesSrv = await this.ProjectService.getFiles(Number(type), projectId);
    if(getFilesSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      'Not Found, File Not Found',
      'service',
      { code: -2 }
    ));

    if(getFilesSrv === -2) return res.status(404).json(this.ResponsePreset.resErr(
      403,
      'Forbidden, File Using Another method',
      'service',
      { code: -3 }
    ));

    res.attachment(getFilesSrv.name);
    res.setHeader('Content-Type', getFilesSrv.mime);
    return res.status(200).send(getFilesSrv.file);
  }

  async getUserProject(req, res) {
    const { targetUserId } = req.params;
    const { userId } = req.middlewares.authorization;
    
    const getUserProjectSrv = await this.ProjectService.getUserProject(targetUserId, userId);

    return res.status(200).json(this.ResponsePreset.resOK(
      'OK',
      getUserProjectSrv
    ));
  }

  async getMyDraft(req, res) {
    const { userId } = req.middlewares.authorization;
    
    const getgetMyDraftSrv = await this.ProjectService.getMyDraft(userId);

    return res.status(200).json(this.ResponsePreset.resOK(
      'OK',
      getgetMyDraftSrv
    ));
  }

  async getUserCollabs(req, res) {
    console.log(req.query)
    const { targetUserId } = req.params;
    const { userId } = req.middlewares.authorization;
    
    const getUserCollabsSrv = await this.ProjectService.getUserCollabs(targetUserId, userId);

    return res.status(200).json(this.ResponsePreset.resOK(
      'OK',
      getUserCollabsSrv
    ));
  }

  // --- Get Project For You
  async getForYou(req, res) {
    const { offset, limit, following } = req.query;
    const { userId } = req.middlewares.authorization;

    if(!offset) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      'Bad Request, Offset Not Provide in Query',
      'service',
      { code: -1 }
    ));

    if(!limit) return req.status(400).json(this.ResponsePreset.resErr(
      400, 
      'Bad Request, Limit Not Provided',
      'service',
      { code: -2 }
    ));

    if(isNaN(offset)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      'Bad Request, Offset is Not a Number',
      'service',
      { code: -3 }
    ));

    if(isNaN(limit)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      'Bad Request, Limit is Not a Number',
      'service',
      { code: -3 }
    ));

    const getForYouSrv = await this.ProjectService.getForYou(Number(offset), Number(limit), userId, following);

    return res.status(200).json(this.ResponsePreset.resOK(
      'OK',
      getForYouSrv
    ));
  }

  // --- Get Project Trends
  async getProjectTrends(req, res) {
    const { userId } = req.middlewares.authorization;
    const getProjectTrendsSrv = await this.ProjectService.getProjectTrends(userId);

    return res.status(200).json(this.ResponsePreset.resOK(
      'OK',
      getProjectTrendsSrv
    ));
  }

  async searchProject(req, res) {
    const { title } = req.params;
    const { userId } = req.middlewares.authorization;

    const searchProjectSrv = await this.ProjectService.searchProject(title, userId);
    
    return res.status(200).json(this.ResponsePreset.resOK(
      'OK',
      searchProjectSrv
    ))
  }
}

export default ProjectController;