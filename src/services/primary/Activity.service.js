import UserModel from "../../models/User.model.js";
import FollowingModel from "../../models/Following.model.js";
import ProjectModel from "../../models/Project.model.js";
import ProjectLikesModel from "../../models/ProjectLikes.model.js";
import ProjectCommentsModel from "../../models/ProjectComments.model.js";

class ActivityService {
  constructor(server) {
    this.server = server;

    this.UserModel = new UserModel(this.server).table;
    this.FollowingModel = new FollowingModel(this.server).table;
    this.ProjectModel = new ProjectModel(this.server).table;
    this.ProjectModel = new ProjectModel(this.server).table;
    this.ProjectLikesModel = new ProjectLikesModel(this.server).table;
    this.ProjectCommentsModel = new ProjectCommentsModel(this.server).table;
  }

  // Follow Fungtion Service
  async follow(userId, followUserId) {
    const getDataUserModel = await this.UserModel.findOne({
      where: { id: followUserId },
      attributes: [
        'id'
      ]
    });

    if(getDataUserModel === null) return -1;
    
    const getDataFollowingModel = await this.FollowingModel.findOne({
      where: { user_id: userId, follow_user_id: followUserId }
    });

    if (getDataFollowingModel !== null) return -2;
      
    await this.FollowingModel.create({ user_id: userId, follow_user_id: followUserId });
  
    return 1;
  }

  // Unfollow Function Service
  async unfollow(userId, followUserId) {
    const getDataUserModel = await this.UserModel.findOne({
      where: { id: followUserId },
      attributes: [
        'id'
      ]
    });

    if(getDataUserModel === null) return -1;

    this.FollowingModel.destroy({
      where: { user_id: userId, follow_user_id: followUserId }
    });

    return 1;
  }

  // Project Like Service
  async likeProject(projectId, userId) {
    const getDataProjectModel = await this.ProjectModel.findOne({
      where: {
        id: projectId,
        published: true
      }
    });

    if(getDataProjectModel === null) return -1;
    
    const getDataProjectLikes = await this.ProjectLikesModel.findOne({
      where: {
        project_id: projectId,
        user_id: userId
      }
    });

    if(getDataProjectLikes !== null) return -2;

    await this.ProjectLikesModel.create({ project_id: projectId, user_id: userId, createdAt: new Date() });
    return 1;
  }

  async unlikeProject(projectId, userId) {
    const getDataProjectModel = await this.ProjectModel.findOne({
      where: {
        id: projectId,
        published: true
      }
    });

    if(getDataProjectModel === null) return -1;
    
    const getDataProjectLikes = await this.ProjectLikesModel.findOne({
      where: {
        project_id: projectId,
        user_id: userId
      }
    });

    if(getDataProjectLikes === null) return -2;

    await this.ProjectLikesModel.destroy({
      where: {
        id: getDataProjectLikes.dataValues.id
      }
    });
    return 1;
  }

  // Project Comment Service
  async commentProject(projectId, userId, comment) {
    const getDataProjectModel = await this.ProjectModel.findOne({
      where: {
        id: projectId,
        published: true
      }
    });

    if(getDataProjectModel === null) return -1;
    
    const getDataProjectCommentsModel = await this.ProjectCommentsModel.findAll({
      where: {
        project_id: projectId,
        user_id: userId
      }
    });

    if(getDataProjectCommentsModel.length === 3) return -2;

    await this.ProjectCommentsModel.create({ project_id: projectId, user_id: userId, comment, createdAt: new Date() });
    return 1;
  }
  
  async delCommentProject(projectId, userId, commentId) {
    const getDataProjectCommentsModel = await this.ProjectCommentsModel.findOne({
      where: {
        id: commentId,
        project_id: projectId,
        user_id: userId
      }
    });

    if(getDataProjectCommentsModel === null) return -1;

    await this.ProjectCommentsModel.destroy({
      where: {
        id: commentId
      }
    });
    return 1;
  }
}

export default ActivityService;