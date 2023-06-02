import ResponsePreset from '../../helpers/ResponsePreset.helper.js';
import ActivityService from '../../services/primary/Activity.service.js';

// Library
import Ajv from 'ajv';

class ActivityController {

  constructor(server) {
    this.server = server;

    this.ResponsePreset = new ResponsePreset();
    this.Ajv = new Ajv();
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
}

export default ActivityController;