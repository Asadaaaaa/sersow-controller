import ProjectModel from "../../models/Project.model.js";
import CategoryModel from "../../models/Category.model.js";
import ProjectCategoryModel from "../../models/ProjectCategory.model.js";
import TagsModel from "../../models/Tags.model.js";
import ProjectTagsModel from "../../models/ProjectTags.model.js";
import UserModel from "../../models/User.model.js";
import ProjectContributorsModel from "../../models/ProjectContributors.model.js";
import ProjectThumbnailModel from "../../models/ProjectThumbnail.model.js";
import ProjectPreviewModel from "../../models/ProjectPreview.model.js";
import ProjectFilesModel from "../../models/ProjectFiles.model.js";
import ProjectRankModel from "../../models/ProjectRank.model.js";
import ProjectFeaturedModel from "../../models/ProjectFeatured.model.js";
import ProjectLikesModel from "../../models/ProjectLikes.model.js";
import ProjectCommentsModel from "../../models/ProjectComments.model.js";
import FollowingModel from "../../models/Following.model.js";
import VerifiedType from "../../models/VerifiedType.model.js";
import UserVerifiedModel from "../../models/UserVerified.model.js";

// Library
import { Op } from "sequelize";
import { fileTypeFromBuffer } from 'file-type';

class ProjectService {
  constructor(server) {
    this.server = server;

    this.ProjectModel = new ProjectModel(this.server).table;
    this.CategoryModel = new CategoryModel(this.server).table;
    this.ProjectCategoryModel = new ProjectCategoryModel(this.server).table;
    this.TagsModel = new TagsModel(this.server).table;
    this.ProjectTagsModel = new ProjectTagsModel(this.server).table;
    this.UserModel = new UserModel(this.server).table;
    this.ProjectContributorsModel = new ProjectContributorsModel(this.server).table;
    this.ProjectThumbnailModel = new ProjectThumbnailModel(this.server).table;
    this.ProjectPreviewModel = new ProjectPreviewModel(this.server).table;
    this.ProjectFilesModel = new ProjectFilesModel(this.server).table;
    this.ProjectRankModel = new ProjectRankModel(this.server).table;
    this.ProjectFeaturedModel = new ProjectFeaturedModel(this.server).table;
    this.ProjectLikesModel = new ProjectLikesModel(this.server).table;
    this.ProjectCommentsModel = new ProjectCommentsModel(this.server).table;
    this.FollowingModel = new FollowingModel(this.server).table;
    this.VerifiedType = new VerifiedType(this.server).table;
    this.UserVerifiedModel = new UserVerifiedModel(this.server).table;
  }

  // Functon For Edit Project
  async manageProject(reqData, isPublished, userId) {
    const {
      id, title, description, categories, otherCtg,
      logo, thumbnail, image1, image2, image3,
      program, paper, code, tags, contributors
    } = reqData;
    let datetime = new Date();

    if (id !== null) {
      const getDataProjectModel = await this.ProjectModel.findOne({ where: {
        id,
        user_id: userId,
        flag_deleted: false,
        flag_takedown: false
      }});

      if (getDataProjectModel === null) return -1;
      if (isPublished === false && getDataProjectModel.dataValues.published === true) return -2;

      if(getDataProjectModel.dataValues.published === true) datetime = new Date(getDataProjectModel.dataValues.published_datetime);

      await this.ProjectContributorsModel.destroy({ where: { project_id: getDataProjectModel.dataValues.id }});
      await this.ProjectCategoryModel.destroy({ where: { project_id: getDataProjectModel.dataValues.id }});
      await this.ProjectTagsModel.destroy({ where: { project_id: getDataProjectModel.dataValues.id }});
      await this.ProjectThumbnailModel.destroy({ where: { project_id: getDataProjectModel.dataValues.id }});
      await this.ProjectPreviewModel.destroy({ where: { project_id: getDataProjectModel.dataValues.id }});
      await this.ProjectFilesModel.destroy({ where: { project_id: getDataProjectModel.dataValues.id }});
    }

    if (categories !== null) {
      const getDataCategoryModel = await this.CategoryModel.findAll({
        where: {
          id: {
            [Op.in]: categories
          }
        }
      });

      if(getDataCategoryModel.length !== categories.length) return -3;

      const idxOtherId = getDataCategoryModel.findIndex(val2 => val2.dataValues.name === "Other");

      if(idxOtherId !== -1) {
        const idxOther = categories.findIndex((val) => val === getDataCategoryModel[idxOtherId].dataValues.id);
        if(idxOther !== -1) categories.splice(idxOther, 1);
      }
      
    }

    let logoFile;
    let logoExt;
    if (logo !== null) {
      logoFile = Buffer.from(logo, 'base64');
      const fileType = await fileTypeFromBuffer(logoFile);
      
      if (!fileType) return -4;
      if (!(fileType && (fileType.ext === 'jpeg' || fileType.ext === 'jpg' || fileType.ext === 'png'))) return -4;
      if (logoFile.byteLength > 1048576) return -5;
      logoExt = fileType.ext;
    }

    let thumbnailFile;
    let thumbnailExt;
    if (thumbnail !== null) {
      if (thumbnail.isUrl !== true) {
        thumbnailFile = Buffer.from(thumbnail.data, 'base64');
        const fileType = await fileTypeFromBuffer(thumbnailFile);
        if (!fileType) return -6;

        if (!(fileType && (fileType.ext === 'jpeg' || fileType.ext === 'jpg' || fileType.ext === 'png'))) return -6;
        if (thumbnailFile.byteLength > 1048576) return -7;
        thumbnailExt = fileType.ext;
      } else {
        thumbnail.data = 'https://www.youtube-nocookie.com/embed/' + thumbnail.data.slice(-11);
      }
    }

    let image1File;
    let image1Ext;
    if (image1 !== null) {
      image1File = Buffer.from(image1, 'base64');
      const fileType = await fileTypeFromBuffer(image1File);
      if (!fileType) return -8;

      if (!(fileType && (fileType.ext === 'jpeg' || fileType.ext === 'jpg' || fileType.ext === 'png'))) return -8;
      if (image1File.byteLength > 1048576) return -9;
      image1Ext = fileType.ext;
    }

    let image2File;
    let image2Ext;
    if (image2 !== null) {
      image2File = Buffer.from(image2, 'base64');
      const fileType = await fileTypeFromBuffer(image2File);
      if (!fileType) return -10;

      if (!(fileType && (fileType.ext === 'jpeg' || fileType.ext === 'jpg' || fileType.ext === 'png'))) return -10;
      if (image2File.byteLength > 1048576) return -11;
      image2Ext = fileType.ext;
    }

    let image3File;
    let image3Ext;
    if (image3 !== null) {
      image3File = Buffer.from(image3, 'base64');
      const fileType = await fileTypeFromBuffer(image3File);
      if (!fileType) return -12;

      if (!(fileType && (fileType.ext === 'jpeg' || fileType.ext === 'jpg' || fileType.ext === 'png'))) return -12;
      if (image3File.byteLength > 1048576) return -13;
      image3Ext = fileType.ext;
    }

    let programFile;
    let programFileExt;
    if (program !== null) {
      if (program.isUrl !== true) {
        programFile = Buffer.from(program.data, 'base64');
        const fileType = await fileTypeFromBuffer(programFile);
        if (!fileType) return -14;

        if (!(fileType && (fileType.ext === 'zip' || fileType.ext === 'exe' || fileType.ext === 'apk'))) return -14;
        if (programFile.byteLength > 3145728) return -15;
        programFileExt = fileType.ext;
      }
    }

    let paperFile;
    let paperFileExt;
    if (paper !== null) {
      if (paper.isUrl !== true) {
        paperFile = Buffer.from(paper.data, 'base64');
        const fileType = await fileTypeFromBuffer(paperFile);
        if (!fileType) return -16;

        if (!(fileType && (fileType.ext === 'pdf'))) return -16;
        if (paperFile.byteLength > 3145728) return -17;
        paperFileExt = fileType.ext;
      }
    }

    let codeFile;
    let codeFileExt;
    if (code !== null) {
      if (code.isUrl !== true) {
        codeFile = Buffer.from(code.data, 'base64');
        const fileType = await fileTypeFromBuffer(codeFile);
        if (!fileType) return -18;

        if (!(fileType && (fileType.ext === 'zip' || fileType.ext === 'rar' || fileType.ext === 'pdf'))) return -18;
        if (codeFile.byteLength > 3145728) return -19;
        codeFileExt = fileType.ext;
      }
    }

    if (contributors !== null) {
      const getDataUserModel = await this.UserModel.findAll({
        where: {
          id: {
            [Op.in]: contributors
          }
        }
      });

      if (getDataUserModel.length !== contributors.length) return -20;
    }

    const transaction = await this.server.model.db.transaction();
    try {
      const addDataProjectModel = await this.ProjectModel.upsert(
        {
          ...(id !== null ? { id } : {}),
          user_id: userId,
          title,
          description,
          published: isPublished,
          published_datetime: datetime
        },
        {
          transaction
        }
      );      
      
      if(categories !== null) {
        const projectCategories = categories.map(categoryId => ({
          project_id: addDataProjectModel[0].dataValues.id,
          category_id: categoryId
        }));
    
        await this.ProjectCategoryModel.bulkCreate(projectCategories, {
          transaction
        });
      }
  
      if (otherCtg !== null) {
        const getDataCategoryModel = await this.CategoryModel.findOne({
          where: { name: 'Other' },
          transaction
        });
  
        await this.ProjectCategoryModel.create(
          { project_id: addDataProjectModel[0].dataValues.id, category_id: getDataCategoryModel.dataValues.id, other: otherCtg },
          { transaction }
        );
      }
      
      if(tags !== null) {
        const projectTags = tags.map((name) => {
          return {
            project_id: addDataProjectModel[0].dataValues.id,
            name
          }
        });
    
        await this.ProjectTagsModel.bulkCreate(projectTags, { transaction });
      }
  
      if (logo) {
        const imagePath = '/server_data/project/logo/' + addDataProjectModel[0].dataValues.id + '.' + logoExt;
  
        this.server.FS.writeFileSync(process.cwd() + imagePath, logoFile);
        await this.ProjectModel.update({ logo_path: imagePath }, {
          where: { id: addDataProjectModel[0].dataValues.id },
          transaction
        });
      }
  
      if (thumbnail) {
        if (thumbnail.isUrl !== true) {
          const imagePath = '/server_data/project/thumbnail/' + addDataProjectModel[0].dataValues.id + '.' + thumbnailExt;
  
          this.server.FS.writeFileSync(process.cwd() + imagePath, thumbnailFile);
          await this.ProjectThumbnailModel.create(
            { project_id: addDataProjectModel[0].dataValues.id, method: 1, url: imagePath },
            { transaction }
          );
        } else {
          await this.ProjectThumbnailModel.create(
            { project_id: addDataProjectModel[0].dataValues.id, method: 2, url: thumbnail.data },
            { transaction }
          );
        }
      }
  
      if (image1) {
        const imagePath = '/server_data/project/preview/' + addDataProjectModel[0].dataValues.id + '-1.' + image1Ext;
  
        this.server.FS.writeFileSync(process.cwd() + imagePath, image1File);
        await this.ProjectPreviewModel.create(
          { project_id: addDataProjectModel[0].dataValues.id, sort: 1,  path: imagePath },
          { transaction }
        );
      }
  
      if (image2) {
        const imagePath = '/server_data/project/preview/' + addDataProjectModel[0].dataValues.id + '-2.' + image2Ext;
  
        this.server.FS.writeFileSync(process.cwd() + imagePath, image2File);
        await this.ProjectPreviewModel.create(
          { project_id: addDataProjectModel[0].dataValues.id, sort: 2,  path: imagePath },
          { transaction }
        );
      }
  
      if (image3) {
        const imagePath = '/server_data/project/preview/' + addDataProjectModel[0].dataValues.id + '-3.' + image3Ext;
  
        this.server.FS.writeFileSync(process.cwd() + imagePath, image3File);
        await this.ProjectPreviewModel.create(
          { project_id: addDataProjectModel[0].dataValues.id, sort: 3,  path: imagePath },
          { transaction }
        );
      }
      
      if (program) {
        if (program.isUrl !== true) {
          const filePath = '/server_data/project/files/' + addDataProjectModel[0].dataValues.id + '-1.' + programFileExt;
  
          this.server.FS.writeFileSync(process.cwd() + filePath, programFile);
          await this.ProjectFilesModel.create(
            { project_id: addDataProjectModel[0].dataValues.id, type: 1, method: 1, url: filePath },
            { transaction }
          );
        } else {
          await this.ProjectFilesModel.create(
            { project_id: addDataProjectModel[0].dataValues.id, type: 1, method: 2, url: program.data },
            { transaction }
          );
        }
      }
  
      if (paper) {
        if (paper.isUrl !== true) {
          const filePath = '/server_data/project/files/' + addDataProjectModel[0].dataValues.id + '-2.' + paperFileExt;
  
          this.server.FS.writeFileSync(process.cwd() + filePath, paperFile);
          await this.ProjectFilesModel.create(
            { project_id: addDataProjectModel[0].dataValues.id, type: 2, method: 1, url: filePath },
            { transaction }
          );
        } else {
          await this.ProjectFilesModel.create(
            { project_id: addDataProjectModel[0].dataValues.id, type: 2, method: 2, url: paper.data },
            { transaction }
          );
        }
      }
  
      if (code) {
        if (code.isUrl !== true) {
          const filePath = '/server_data/project/files/' + addDataProjectModel[0].dataValues.id + '-3.' + codeFileExt;
  
          this.server.FS.writeFileSync(process.cwd() + filePath, codeFile);
          await this.ProjectFilesModel.create(
            { project_id: addDataProjectModel[0].dataValues.id, type: 3, method: 1, url: filePath },
            { transaction }
          );
        } else {
          await this.ProjectFilesModel.create(
            { project_id: addDataProjectModel[0].dataValues.id, type: 3, method: 2, url: code.data },
            { transaction }
          );
        }
      }

      if (contributors !== null) {
        const projectContributors = contributors.map(val => ({
          project_id: addDataProjectModel[0].dataValues.id,
          user_id: val
        }));

        await this.ProjectContributorsModel.bulkCreate(projectContributors, {
          transaction
        });
      }
      
      await transaction.commit();
    } catch (err) {
      console.log(err)
      return -500;
    }

    return 1;
  }

  // Draft Project Function Service
  async draftProject(reqData, userId) {
    const getManageProject = await this.manageProject(reqData, false, userId);
    return getManageProject;
  }

  // Publish Project Function Service
  async publishProject(reqData, userId) {
    const getManageProject = await this.manageProject(reqData, true, userId);
    return getManageProject;
  }

  async deleteProject(userId, projectId) {
    const [count] = await this.ProjectModel.update({ flag_deleted: true }, {
      where: {
        id: projectId,
        user_id: userId,
        flag_takedown: false
      }
    });

    if(count === 0) return -1;
    return 1;
  }

  async deleteCollabs(userId, projectId) {
    const affectedCountProjectContributorsModel = await this.ProjectContributorsModel.destroy({
      where: {
        user_id: userId,
        project_id: projectId
      }
    });

    if(affectedCountProjectContributorsModel === 0) return -1;
    return 1;
  }

  async getManageProject(userId, projectId) {
    const getDataProjectModel = await this.ProjectModel.findOne({
      where: {
        id: projectId,
        user_id: userId,
        flag_deleted: false,
        flag_takedown: false
      },
      attributes: [
        'id',
        'title',
        'description',
        ['logo_path', 'logo'],
        'published',
        'published_datetime'
      ]
    });

    if(getDataProjectModel === null) return -1;

    getDataProjectModel.dataValues.logo = getDataProjectModel.dataValues.logo !== null ? this.server.FS.readFileSync(process.cwd() + getDataProjectModel.dataValues.logo).toString('base64') : null;
    getDataProjectModel.dataValues.published_datetime = new Date(getDataProjectModel.dataValues.published_datetime).getTime();

    const getDataProjectCategoryModel = await this.ProjectCategoryModel.findAll({
      where: {
        project_id: projectId
      }
    });
    
    if(getDataProjectCategoryModel.length !== 0) {
      const getDataCategoryModel = await this.CategoryModel.findAll({
        where: {
          id: {
            [Op.in]: getDataProjectCategoryModel.map(val => val.dataValues.category_id)
          }
        },
        order: [
          [this.server.model.db.literal(`CASE WHEN name = 'Other' THEN 1 ELSE 0 END`), 'ASC'],
          ['name', 'ASC']
        ]
      });

      getDataProjectModel.dataValues.categories = getDataCategoryModel.map(val => val.dataValues.id);

      for(let j in getDataCategoryModel) {
        if(getDataCategoryModel[j].dataValues.name === 'Other') {
          const indexOther = getDataProjectCategoryModel.findIndex(val => val.dataValues.category_id === getDataCategoryModel[j].dataValues.id);
          
          getDataProjectModel.dataValues.otherCtg = getDataProjectCategoryModel[indexOther].dataValues.other;
        }
      }
    } else {
      getDataProjectModel.dataValues.categories = null;
      getDataProjectModel.dataValues.otherCtg = null;
    }

    const getDataProjectThumbnailModel = await this.ProjectThumbnailModel.findOne({
      where: {
        project_id: projectId
      },
      plain: true
    });

    if(getDataProjectThumbnailModel !== null) {
      getDataProjectModel.dataValues.thumbnail = {
        isUrl: getDataProjectThumbnailModel.method === 1 ? false : true,
        url: getDataProjectThumbnailModel.method === 1 ? this.server.FS.readFileSync(process.cwd() + getDataProjectThumbnailModel.url).toString('base64') : getDataProjectThumbnailModel.dataValues.url
      }
    } else {
      getDataProjectModel.dataValues.thumbnail = null;
    }

    const getDataProjectPreviewModel = await this.ProjectPreviewModel.findAll({
      where: {
        project_id: projectId
      },
      order: [
        ['sort', 'ASC']
      ]
    });

    getDataProjectModel.dataValues.image1 = getDataProjectPreviewModel[0] ?  this.server.FS.readFileSync(process.cwd() + getDataProjectPreviewModel[0].dataValues.path).toString('base64') : null;
    getDataProjectModel.dataValues.image2 = getDataProjectPreviewModel[1] ?  this.server.FS.readFileSync(process.cwd() + getDataProjectPreviewModel[1].dataValues.path).toString('base64') : null;
    getDataProjectModel.dataValues.image3 = getDataProjectPreviewModel[2] ?  this.server.FS.readFileSync(process.cwd() + getDataProjectPreviewModel[2].dataValues.path).toString('base64') : null;

    const getDataProjectFilesModel = await this.ProjectFilesModel.findAll({
      where: {
        project_id: projectId
      },
      order: [['type', 'ASC']]
    });

    getDataProjectModel.dataValues.program = null;
    getDataProjectModel.dataValues.paper = null;
    getDataProjectModel.dataValues.code = null;

    if(getDataProjectFilesModel.length !== 0) {
      getDataProjectFilesModel.forEach(val => {
        if(val.dataValues.type === 1) getDataProjectModel.dataValues.program = {
          isUrl: val.dataValues.method === 1 ? false : true,
          url: val.dataValues.method === 1 ? this.server.FS.readFileSync(process.cwd() + val.dataValues.url).toString('base64') : val.dataValues.url,
        }
        
        if(val.dataValues.type === 2) getDataProjectModel.dataValues.paper = {
          isUrl: val.dataValues.method === 1 ? false : true,
          url: val.dataValues.method === 1 ? this.server.FS.readFileSync(process.cwd() + val.dataValues.path).toString('base64') : val.dataValues.url,
        }

        if(val.dataValues.type === 3) getDataProjectModel.dataValues.code = {
          isUrl: val.dataValues.method === 1 ? false : true,
          url: val.dataValues.method === 1 ? this.server.FS.readFileSync(process.cwd() + val.dataValues.path).toString('base64') : val.dataValues.url,
        }
      });
    }

    const getDataProjectTagsModel = await this.ProjectTagsModel.findAll({
      where: {
        project_id: projectId
      }
    });    
    getDataProjectModel.dataValues.tags = getDataProjectTagsModel.length !== 0 ? getDataProjectTagsModel.map((val) => val.dataValues.name) : null;
    
    const getDataProjectContributorsModel = await this.ProjectContributorsModel.findAll({
      where: {
        project_id: projectId
      }
    });

    const getDataUserModel = await this.UserModel.findAll({
      where: {
        id: {
          [Op.in]: getDataProjectContributorsModel.map(val => val.dataValues.user_id)
        }
      }
    });

    getDataProjectModel.dataValues.contributors = getDataUserModel.length !== 0 ? getDataUserModel.map((val) => {
      return {
        user_id: val.dataValues.id,
        username: val.dataValues.username
      }
    }) : null;

    return getDataProjectModel.dataValues;
  }

  async getDetails(projectId, userId) {
    const getDataProjectModel = await this.ProjectModel.findOne({
      where: {
        id: projectId,
        flag_deleted: false,
        flag_takedown: false
      },
      attributes: [
        'id',
        'user_id',
        'title',
        'description',
        ['logo_path', 'logo'],
        'published',
        'published_datetime'
      ]
    });

    if(getDataProjectModel === null) return -1;
    if(getDataProjectModel.dataValues.published === false && getDataProjectModel.dataValues.user_id !== userId) return -1;

    getDataProjectModel.dataValues.isMyProject = getDataProjectModel.dataValues.user_id === userId ? true : false;
    getDataProjectModel.dataValues.logo = getDataProjectModel.dataValues.logo !== null ? '/project/get/logo/' + projectId : null;
    getDataProjectModel.dataValues.published_datetime = new Date(getDataProjectModel.dataValues.published_datetime).getTime();
    
    const getDataUserModel = await this.UserModel.findOne({
      where: {
        id: getDataProjectModel.dataValues.user_id
      }
    });
    
    delete getDataProjectModel.dataValues.user_id;
    getDataProjectModel.dataValues.owner = {
      id: getDataUserModel.dataValues.id,
      name: getDataUserModel.dataValues.name,
      nameSubstr: getDataUserModel.dataValues.name.length > 20 ? getDataUserModel.dataValues.name.substring(0, 20) + "..." : getDataUserModel.dataValues.name,
      username: getDataUserModel.dataValues.username,
      image: '/profile/get/photo/' + getDataUserModel.dataValues.id
    }

    const getDataUserVerifiedModel = await this.UserVerifiedModel.findOne({
      where: {
        user_id: getDataProjectModel.dataValues.owner.id
      }
    });

    if(getDataUserVerifiedModel !== null) {
      const getDataVerifiedType = await this.VerifiedType.findOne({
        where: {
          id: getDataUserVerifiedModel.dataValues.verified_type_id
        }
      });

      getDataProjectModel.dataValues.owner.verified = getDataVerifiedType !== null ? {
        type: getDataVerifiedType.dataValues.type,
        logo: this.server.FS.readFileSync(process.cwd() + getDataVerifiedType.dataValues.logo_path).toString('base64')
      } : null;
    } else getDataProjectModel.dataValues.owner.verified = null;
    
    const getDataProjectCategoryModel = await this.ProjectCategoryModel.findAll({
      where: {
        project_id: projectId
      }
    });
    
    if(getDataProjectCategoryModel.length !== 0) {
      const getDataCategoryModel = await this.CategoryModel.findAll({
        where: {
          id: {
            [Op.in]: getDataProjectCategoryModel.map(val => val.dataValues.category_id)
          }
        },
        order: [
          [this.server.model.db.literal(`CASE WHEN name = 'Other' THEN 1 ELSE 0 END`), 'ASC'],
          ['name', 'ASC']
        ]
      });

      for(let j in getDataCategoryModel) {
        if(getDataCategoryModel[j].dataValues.name === 'Other') {
          const indexOther = getDataProjectCategoryModel.findIndex(val => val.dataValues.category_id === getDataCategoryModel[j].dataValues.id);
          getDataCategoryModel[j].dataValues.name = getDataProjectCategoryModel[indexOther].dataValues.other;
        }
      }

      getDataProjectModel.dataValues.categories = getDataCategoryModel.map(val => val.dataValues.name);
    } else {
      getDataProjectModel.dataValues.categories = null;
    }
    
    const getDataProjectThumbnailModel = await this.ProjectThumbnailModel.findOne({
      where: {
        project_id: projectId
      },
      plain: true
    });

    if(getDataProjectThumbnailModel !== null) {
      getDataProjectModel.dataValues.thumbnail = {
        isUrl: getDataProjectThumbnailModel.dataValues.method === 1 ? false : true,
        url: getDataProjectThumbnailModel.dataValues.method === 1 ?  '/project/get/thumbnail/' + projectId : getDataProjectThumbnailModel.url
      }
    } else {
      getDataProjectModel.dataValues.thumbnail = null;
    }

    const getDataProjectPreviewModel = await this.ProjectPreviewModel.findAll({
      where: {
        project_id: projectId
      },
      order: [
        ['sort', 'ASC']
      ]
    });

    if(getDataProjectPreviewModel.length !== 0) {
      getDataProjectModel.dataValues.preview = getDataProjectPreviewModel.map((val) => {
        return '/project/get/preview/' + val.dataValues.sort + '/' + projectId
      });
    } else {
      getDataProjectModel.dataValues.preview = null;
    }

    const getDataProjectContributorsModel = await this.ProjectContributorsModel.findAll({
      where: {
        project_id: getDataProjectModel.dataValues.id
      }
    });

    getDataProjectModel.dataValues.contributors = getDataProjectContributorsModel.length !== 0 ? getDataProjectContributorsModel.map((val) => '/profile/get/photo/' + val.dataValues.user_id) : null;
    
    const getDataProjectTagsModel = await this.ProjectTagsModel.findAll({
      where: {
        project_id: projectId
      }
    });
    
    if(getDataProjectTagsModel.length !== 0) {
      getDataProjectModel.dataValues.tags = getDataProjectTagsModel.map((val) => {
        return val.dataValues.name
      });
    } else {
      getDataProjectModel.dataValues.tags = null;
    }

    const getDataProjectFilesModel = await this.ProjectFilesModel.findAll({
      where: {
        project_id: projectId
      },
      order: [['type', 'ASC']]
    });

    getDataProjectModel.dataValues.program = null;
    getDataProjectModel.dataValues.paper = null;
    getDataProjectModel.dataValues.code = null;

    if(getDataProjectFilesModel.length !== 0) {
      getDataProjectFilesModel.forEach(val => {
        if(val.dataValues.type === 1) getDataProjectModel.dataValues.program = {
          isUrl: val.dataValues.method === 1 ? false : true,
          url: val.dataValues.method === 1 ? '/project/get/files/' + val.dataValues.type + '/' + projectId : val.dataValues.url,
        }
        
        if(val.dataValues.type === 2) getDataProjectModel.dataValues.paper = {
          isUrl: val.dataValues.method === 1 ? false : true,
          url: val.dataValues.method === 1 ? '/project/get/files/' + val.dataValues.type + '/' + projectId : val.dataValues.url,
        }

        if(val.dataValues.type === 3) getDataProjectModel.dataValues.code = {
          isUrl: val.dataValues.method === 1 ? false : true,
          url: val.dataValues.method === 1 ? '/project/get/files/' + val.dataValues.type + '/' + projectId : val.dataValues.url,
        }
      });
    }

    const getDataProjectLikesModel = await this.ProjectLikesModel.findAll({
      where: {
        project_id: projectId
      },
      attributes: [
        'user_id'
      ]
    });

    getDataProjectModel.dataValues.totalLikes = getDataProjectLikesModel.length;

    if(userId) {
      const isUserExistProjectLikesModel = await this.ProjectLikesModel.findOne({
        where: {
          project_id: projectId,
          user_id: userId
        }
      });

      getDataProjectModel.dataValues.isLiked = isUserExistProjectLikesModel !== null ? true : false;
    } else {
      getDataProjectModel.dataValues.isLiked = false;
    }

    if(userId) {
      const getDataUserModel = await this.UserModel.findOne({
        where: {
          id: userId
        }
      });
      getDataProjectModel.dataValues.myIdentity = getDataUserModel ? {
        id: getDataUserModel.dataValues.id,
        name: getDataUserModel.dataValues.name,
        nameSubstr: getDataUserModel.dataValues.name.length > 20 ? getDataUserModel.dataValues.name.substring(0, 20) + "..." : getDataUserModel.dataValues.name,
        username: getDataUserModel.dataValues.username,
        gender: getDataUserModel.dataValues.gender,
        image: '/profile/get/photo/' + getDataUserModel.dataValues.id
      } : null
    } else {
      getDataProjectModel.dataValues.myIdentity = null;
    }

    const getDataProjectComments = await this.ProjectCommentsModel.findAll({
      where: {
        project_id: projectId
      },
      order: [
        ['createdAt', 'DESC']
      ]
    });

    getDataProjectModel.dataValues.comments = [];
    for(let i in getDataProjectComments) {
      const getDataUserModel = await this.UserModel.findOne({
        where: {
          id: getDataProjectComments[i].dataValues.user_id
        }
      });

      getDataProjectModel.dataValues.comments.push({
        userId: getDataUserModel.dataValues.id,
        name: getDataUserModel.dataValues.name,
        nameSubstr: getDataUserModel.dataValues.name.length > 20 ? getDataUserModel.dataValues.name.substring(0, 20) + "..." : getDataUserModel.dataValues.name,
        username: getDataUserModel.dataValues.username,
        gender: getDataUserModel.dataValues.gender,
        image: '/profile/get/photo/' + getDataUserModel.dataValues.id,
        isMyComment: userId === getDataUserModel.dataValues.id ? true : false,
        commentId: getDataProjectComments[i].dataValues.id,
        comment: getDataProjectComments[i].dataValues.comment
      });
    }

    return getDataProjectModel.dataValues;
  }

  async getContributors(userId, projectId) {
    const getDataProjectModel = await this.ProjectModel.findOne({
      where: {
        id: projectId
      }
    });

    if(getDataProjectModel === null) return -1;

    const getDataProjectContributorsModel = await this.ProjectContributorsModel.findAll({
      where: {
        project_id: projectId
      }
    });

    const getDataUserModel = await this.UserModel.findAll({
      where: {
        id: {
          [Op.in]: [getDataProjectModel.dataValues.user_id, ...getDataProjectContributorsModel.map(val => val.dataValues.user_id)]
        }
      },
      attributes: [
        ['id', 'user_id'],
        'name',
        'username'
      ],
      order: [
        [this.server.model.db.literal(`CASE WHEN id = '${getDataProjectModel.dataValues.user_id}' THEN 1 ELSE 0 END`), 'DESC']
      ]
    });

    for(let j in getDataUserModel) {
      getDataUserModel[j].dataValues.nameSubstr = getDataUserModel[j].dataValues.name.length > 20 ? getDataUserModel[j].dataValues.name.substring(0, 20) + "..." : getDataUserModel[j].dataValues.name,
      getDataUserModel[j].dataValues.image = '/profile/get/photo/' + getDataUserModel[j].dataValues.user_id;
      getDataUserModel[j].dataValues.isMyProfile = getDataUserModel[j].dataValues.user_id === userId ? true : false;

      const getDataUserVerifiedModel = await this.UserVerifiedModel.findOne({
        where: {
          user_id: getDataUserModel[j].dataValues.user_id
        }
      });
  
      if(getDataUserVerifiedModel !== null) {
        const getDataVerifiedType = await this.VerifiedType.findOne({
          where: {
            id: getDataUserVerifiedModel.dataValues.verified_type_id
          }
        });
  
        getDataUserModel[j].dataValues.verified = getDataVerifiedType !== null ? {
          type: getDataVerifiedType.dataValues.type,
          logo: this.server.FS.readFileSync(process.cwd() + getDataVerifiedType.dataValues.logo_path).toString('base64')
        } : null;
      } else getDataUserModel[j].dataValues.verified = null;
      
      if(userId) {
        const getDataFollowingModel = await this.FollowingModel.findOne({
          where: {
            user_id: userId,
            follow_user_id: getDataUserModel[j].dataValues.user_id
          }
        });
        
        getDataUserModel[j].dataValues.isFollowed = getDataFollowingModel !== null ? true : false;
      } else {
        getDataUserModel[j].dataValues.isFollowed = false;
      }
    }

    return getDataUserModel;
  }

  async getLogo(projectId) {
    const getDataProjectModel = await this.ProjectModel.findOne({
      where: {
        id: projectId
      }
    });

    if(getDataProjectModel === null) return -1;
    if(getDataProjectModel.dataValues.logo_path === null) return -2;

    const file = this.server.FS.readFileSync(process.cwd() + getDataProjectModel.dataValues.logo_path);
    const { mime } = await fileTypeFromBuffer(file);

    return {
      file, mime
    };
  }

  async getThumbnail(projectId) {
    const getDataProjectThumbnailModel = await this.ProjectThumbnailModel.findOne({
      where: {
        project_id: projectId
      }
    });

    if(getDataProjectThumbnailModel === null) return -1;
    if(getDataProjectThumbnailModel.dataValues.method !== 1) return -2;

    const file = this.server.FS.readFileSync(process.cwd() + getDataProjectThumbnailModel.dataValues.url);
    const { mime } = await fileTypeFromBuffer(file);

    return {
      file, mime
    };
  }

  // Get Preview Image Service
  async getPreviewImage(sort, projectId) {
    const getDataProjectPreviewModel = await this.ProjectPreviewModel.findOne({
      where: {
        project_id: projectId,
        sort
      }
    });

    if(getDataProjectPreviewModel === null) return -1;

    const file = this.server.FS.readFileSync(process.cwd() + getDataProjectPreviewModel.dataValues.path);
    const { mime } = await fileTypeFromBuffer(file);

    return {
      file, mime
    };
  }

  async getFiles(type, projectId) {
    const getDataProjectFiles = await this.ProjectFilesModel.findOne({
      where: {
        project_id: projectId,
        type
      }
    });

    if(getDataProjectFiles === null) return -1;
    if(getDataProjectFiles.dataValues.method !== 1) return -2;

    const getDataProjectModel = await this.ProjectModel.findOne({
      where: {
        id: projectId
      }
    });

    const file = this.server.FS.readFileSync(process.cwd() + getDataProjectFiles.dataValues.url);
    const { mime } = await fileTypeFromBuffer(file);
    
    return {
      file, mime, name: getDataProjectModel.dataValues.title + " - " + ( type === 1 ? "Program" : type === 2 ? "Paper" : type === 3 ? "Code" : "" ) + "." + mime.split('/')[1]
    };
  }

  async getMyDraft(userId) {
    const getDataProjectModel = await this.ProjectModel.findAll({
      where: {
        user_id: userId,
        published: false,
        flag_deleted: false,
        flag_takedown: false
      },
      order: [
        ['published_datetime', 'DESC']
      ],
      attributes: [
        'id',
        'user_id',
        'title',
        'description',
        ['logo_path', 'logo']
      ]
    });
    
    return await this.getListPreviewProjects(getDataProjectModel, userId);
  }

  async getUserProject(targetUserId, userId) {
    const getDataProjectModel = await this.ProjectModel.findAll({
      where: {
        user_id: targetUserId,
        published: true,
        flag_deleted: false,
        flag_takedown: false
      },
      order: [
        ['published_datetime', 'DESC']
      ],
      attributes: [
        'id',
        'user_id',
        'title',
        'description',
        ['logo_path', 'logo']
      ]
    });
    
    return this.getListPreviewProjects(getDataProjectModel, userId);
  }

  async getUserCollabs(targetUserId, userId) {
    const getDataProjectModel = await this.ProjectModel.findAll({
      where: {
        id: {
          [Op.in]: this.server.model.db.literal(`(SELECT project_id FROM project_contributors WHERE user_id = "${targetUserId}")`)
        },
        published: true,
        flag_deleted: false,
        flag_takedown: false
      },
      order: [
        ['published_datetime', 'DESC']
      ],
      attributes: [
        'id',
        'user_id',
        'title',
        'description',
        ['logo_path', 'logo']
      ]
    });
    
    return this.getListPreviewProjects(getDataProjectModel, userId);
  }

  // For You Page Service
  async getForYou(offset, limit, userId, following) {
    const getDataProjectModel = await this.ProjectModel.findAll({
      where: {
        published: true,
        ...(following === "true" && userId ? { user_id: {
          [Op.in]: this.server.model.db.literal(`(SELECT follow_user_id FROM following WHERE user_id = '${userId}')`)
        }} : {}),
        flag_deleted: false,
        flag_takedown: false
      },
      order: [['published_datetime', 'DESC']],
      offset: (offset - 1) * limit,
      limit,
      attributes: [
        'id',
        'user_id',
        'title',
        'description',
        ['logo_path', 'logo']
      ]
    });
    
    return await this.getListPreviewProjects(getDataProjectModel, userId);
  }

  async getProjectTrends(userId) {
    const getDataProjectRankModel = await this.ProjectRankModel.findAll({
      attributes: [
        ['project_id', 'id'],
        'user_id',
        'title',
        'description',
        ['logo_path', 'logo']
      ]
    });

    return await this.getListPreviewProjects(getDataProjectRankModel, userId);
  }

  async getProjectFeatured() {
    const getDataProjectFeaturedModel = await this.ProjectFeaturedModel.findAll({
      attributes: [
        ['project_id', 'id'],
        'user_id',
        'title',
        'description',
        ['logo_path', 'logo']
      ]
    });

    return await this.getListPreviewProjects(getDataProjectFeaturedModel, null);
  }

  async getCategoryProject() {
    const getDataCategoryModel = await this.CategoryModel.findAll({
      order: [
        [this.server.model.db.literal(`CASE WHEN name = 'Other' THEN 1 ELSE 0 END`), 'ASC'],
        ['name', 'ASC']
      ]
    });
    
    return getDataCategoryModel;
  }

  async searchProject(text, category, userId) {
    // Declare Relation
    this.ProjectModel.hasMany(this.ProjectCategoryModel, {
      foreignKey: 'project_id'
    });
    this.ProjectCategoryModel.belongsTo(this.ProjectModel, {
      foreignKey: 'project_id'
    });
    
    // Get Data
    const getDataProjectModel = await this.ProjectModel.findAll({
      where: {
        ...(!text ? {} : {
          title: {
            [Op.substring]:  `%${text}%`
          }
        }),
        published: true,
        flag_deleted: false,
        flag_takedown: false
      },
      include: [
        {
          model: this.ProjectCategoryModel,    
          attributes: [],
          where: {
            ...(!category ? {} : Array.isArray(category) ? {
              category_id: {
                [Op.in]: category
              }
            } : {
              category_id: category
            })
          }
        }
      ],
      attributes: [
        'id',
        'user_id',
        'title',
        'description',
        ['logo_path', 'logo'],
        'published_datetime'
      ],
      order: [['published_datetime', 'DESC']],
      limit: 10
    });

    // Condition Search By Tags if Data Length < 10
    if (getDataProjectModel.length < 10 && text) {
        // Declare Relation
      this.ProjectModel.hasMany(this.ProjectTagsModel, {
        foreignKey: 'project_id'
      });
      this.ProjectTagsModel.belongsTo(this.ProjectModel, {
        foreignKey: 'project_id'
      });
      
      const getDataProjectModelByProjectTagsModel = await this.ProjectModel.findAll({
        where: {
          id: {
            [Op.notIn]: getDataProjectModel.map((val) => val.dataValues.id)
          },
          published: true,
          flag_deleted: false,
          flag_takedown: false
        },
        include: [
          {
            model: this.ProjectTagsModel,
            attributes: [],
            where: {
              name: text
            }
          },
          {
            model: this.ProjectCategoryModel,
            attributes: [],
            where: {
              ...(!category ? {} : Array.isArray(category) ? {
                category_id: {
                  [Op.in]: category
                }
              } : {
                category_id: category
              })
            }
          }
        ],
        attributes: [
          'id',
          'user_id',
          'title',
          'description',
          ['logo_path', 'logo'],
          'published_datetime'
        ],
        order: [['published_datetime', 'DESC']],
        limit: 10 - getDataProjectModel.length
      });
    
      getDataProjectModel.push(...getDataProjectModelByProjectTagsModel);
    }
    
    return this.getListPreviewProjects(getDataProjectModel, userId);
  }

  async getListPreviewProjects(dataProjectModel, userId) {
    for(let i in dataProjectModel) {
      const getDataUserModel = await this.UserModel.findOne({
        where: {
          id: dataProjectModel[i].dataValues.user_id
        }
      });

      delete dataProjectModel[i].dataValues.user_id;
      dataProjectModel[i].dataValues.owner = {
        id: getDataUserModel.dataValues.id,
        name: getDataUserModel.dataValues.name,
        nameSubstr: getDataUserModel.dataValues.name.length > 20 ? getDataUserModel.dataValues.name.substring(0, 20) + "..." : getDataUserModel.dataValues.name,
        username: getDataUserModel.dataValues.username,
        image: '/profile/get/photo/' + getDataUserModel.dataValues.id
      }

      const getDataUserVerifiedModel = await this.UserVerifiedModel.findOne({
        where: {
          user_id: dataProjectModel[i].dataValues.owner.id
        }
      });
  
      if(getDataUserVerifiedModel !== null) {
        const getDataVerifiedType = await this.VerifiedType.findOne({
          where: {
            id: getDataUserVerifiedModel.dataValues.verified_type_id
          }
        });
  
        dataProjectModel[i].dataValues.owner.verified = getDataVerifiedType !== null ? {
          type: getDataVerifiedType.dataValues.type,
          logo: this.server.FS.readFileSync(process.cwd() + getDataVerifiedType.dataValues.logo_path).toString('base64')
        } : null;
      } else dataProjectModel[i].dataValues.owner.verified = null;

      if(dataProjectModel[i].dataValues.logo) dataProjectModel[i].dataValues.logo = '/project/get/logo/' + dataProjectModel[i].dataValues.id;

      const getDataProjectContributorsModel = await this.ProjectContributorsModel.findAll({
        where: {
          project_id: dataProjectModel[i].dataValues.id
        }
      });

      dataProjectModel[i].dataValues.contributors = getDataProjectContributorsModel.length !== 0 ? getDataProjectContributorsModel.map((val) => '/profile/get/photo/' + val.dataValues.user_id) : null;

      const getDataProjectCategoryModel = await this.ProjectCategoryModel.findAll({
        where: {
          project_id: dataProjectModel[i].dataValues.id
        },
      });
      
      if(getDataProjectCategoryModel.length !== 0) {
        const getDataCategoryModel = await this.CategoryModel.findAll({
          where: {
            id: {
              [Op.in]: getDataProjectCategoryModel.map(val => val.dataValues.category_id)
            }
          },
          order: [
            [this.server.model.db.literal(`CASE WHEN name = 'Other' THEN 1 ELSE 0 END`), 'ASC'],
            ['name', 'ASC']
          ]
        });

        for(let j in getDataCategoryModel) {
          if(getDataCategoryModel[j].dataValues.name === 'Other') {
            const indexOther = getDataProjectCategoryModel.findIndex(val => val.dataValues.category_id === getDataCategoryModel[j].dataValues.id);
            getDataCategoryModel[j].dataValues.name = getDataProjectCategoryModel[indexOther].dataValues.other;
          }
        }

        dataProjectModel[i].dataValues.categories = getDataCategoryModel.map(val => val.dataValues);
      } else {
        dataProjectModel[i].dataValues.categories = null;
      }

      const getDataProjectThumbnailModel = await this.ProjectThumbnailModel.findOne({
        where: {
          project_id: dataProjectModel[i].dataValues.id
        }
      });
      
      if(getDataProjectThumbnailModel !== null) {
        dataProjectModel[i].dataValues.thumbnail = {};

        if(getDataProjectThumbnailModel.dataValues.method === 1) {
          dataProjectModel[i].dataValues.thumbnail.isUrl = false;
          dataProjectModel[i].dataValues.thumbnail.data = '/project/get/thumbnail/' + dataProjectModel[i].dataValues.id;
        } else {
          dataProjectModel[i].dataValues.thumbnail.isUrl = true;
          dataProjectModel[i].dataValues.thumbnail.data = getDataProjectThumbnailModel.dataValues.url;
        }
      } else {
        dataProjectModel[i].dataValues.thumbnail = null;
      }

      if(userId) {
        const getDataProjectLikesModel = await this.ProjectLikesModel.findOne({
          where: {
            project_id: dataProjectModel[i].dataValues.id,
            user_id: userId
          }
        });
  
        dataProjectModel[i].dataValues.isLiked = getDataProjectLikesModel !== null ? true : false;
      } else {
        dataProjectModel[i].dataValues.isLiked = false;
      }
    }

    return dataProjectModel;
  }
}

export default ProjectService;