import ResponsePreset from '../../helpers/ResponsePreset.helper.js';
import ActivityValidator from '../../validators/primary/Activity.validator.js';
import ActivityService from '../../services/primary/Activity.service.js';

// Library
import Ajv from 'ajv';

class ActivityController {

  constructor(server) {
    this.server = server;

    this.ResponsePreset = new ResponsePreset();
    this.Ajv = new Ajv();
    this.ActivityValidator = new ActivityValidator();
    this.ActivityService = new ActivityService(this.server);
  }

  // --- Update Username
  async follow(req, res) {
    const { userId } = req.middlewares.authorization;
    const followUserId = req.params.userId;

    if(!followUserId) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      "Bad Request, Parameter User Id Not Provided",
      'service',
      { code: -1 }
    ));
    
    if(userId === followUserId) return res.status(403).json(this.ResponsePreset.resErr(
      403,
      "Forbidden, Can't Follow Itself",
      'service',
      { code: -2 }
    ));
    
    const followSrv = await this.ActivityService.follow(userId, followUserId);
    
    if(followSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      "Not Found, Target Follow User Id Not Found",
      'service',
      { code: -3 }
    ));

    return res.status(200).json(this.ResponsePreset.resOK('OK', null));
  }

  async unfollow(req, res) {
    const { userId } = req.middlewares.authorization;
    const unfollowUserId = req.params.userId;

    if(!unfollowUserId) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      "Bad Request, Parameter User Id Not Provided",
      'service',
      { code: -1 }
    ));
    
    if(userId === unfollowUserId) return res.status(403).json(this.ResponsePreset.resErr(
      403,
      "Forbidden, Can't Unfollow Itself",
      'service',
      { code: -2 }
    ));

    const unfollowSrv = await this.ActivityService.unfollow(userId, unfollowUserId);
    
    if(unfollowSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      "Not Found, Target Unfollow User Id Not Found",
      'service',
      { code: -3 }
    ));

    return res.status(200).json(this.ResponsePreset.resOK('OK', null));
  }

  async likeProject(req, res) {
    const { projectId } = req.params;
    const { userId } = req.middlewares.authorization;

    const getLikeProjectSrv = await this.ActivityService.likeProject(projectId, userId);
    
    if(getLikeProjectSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      'Not Found, Project Not Exist',
      'service',
      { code: -1 }
    ));
    
    if(getLikeProjectSrv === -2) return res.status(403).json(this.ResponsePreset.resErr(
      403,
      'Forbidden, Project Already Liked',
      'service',
      { code: -2 }
    ));

    return res.status(200).json(this.ResponsePreset.resOK(
      'OK',
      null
    ));
  }

  async unlikeProject(req, res) {
    const { projectId } = req.params;
    const { userId } = req.middlewares.authorization;

    const getLikeProjectSrv = await this.ActivityService.unlikeProject(projectId, userId);
    
    if(getLikeProjectSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      'Not Found, Project Not Exist',
      'service',
      { code: -1 }
    ));
    
    if(getLikeProjectSrv === -2) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      'Forbidden, Your Like Not Found',
      'service',
      { code: -2 }
    ));

    return res.status(200).json(this.ResponsePreset.resOK(
      'OK',
      null
    ));
  }

  async commentProject(req, res) {
    const schemeValidate = this.Ajv.compile(this.ActivityValidator.commentProject);
    
    if(!schemeValidate(req.body)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      schemeValidate.errors[0].message,
      'validator',
      schemeValidate.errors[0]
    ));
    
    const { projectId } = req.params;
    const { userId } = req.middlewares.authorization;
    const { comment } = req.body;

    const getCommentProjectSrv = await this.ActivityService.commentProject(projectId, userId, comment);
    
    if(getCommentProjectSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      'Not Found, Project Not Exist',
      'service',
      { code: -1 }
    ));

    if(getCommentProjectSrv === -2) return res.status(403).json(this.ResponsePreset.resErr(
      403,
      'Forbidden, Comment Has Reach The Limit',
      'service',
      { code: -2 }
    ));

    return res.status(200).json(this.ResponsePreset.resOK(
      'OK',
      null
    ));
  }

  async delCommentProject(req, res) {
    const { projectId, commentId } = req.params;
    const { userId } = req.middlewares.authorization;

    const getCommentProjectSrv = await this.ActivityService.delCommentProject(projectId, userId, commentId);
    
    if(getCommentProjectSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      'Not Found, Comment Not Exist',
      'service',
      { code: -1 }
    ));

    return res.status(200).json(this.ResponsePreset.resOK(
      'OK',
      null
    ));
  }
}

export default ActivityController;