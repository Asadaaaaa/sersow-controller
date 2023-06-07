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
  }

  // Functon For Edit Project
  async manageProject(reqData, isPublished) {
    const {
      id, title, description, categories, otherCtg,
      logo, thumbnail, image1, image2, image3,
      program, paper, code, tags, contributors
    } = reqData;

    if (id !== null) {
      const getDataProjectModel = await this.ProjectModel.findOne({ where: { id } });

      if (getDataProjectModel === null) return -1;
      if (isPublished === false && getDataProjectModel.dataValues.published === true) return -2;

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
    }

    let logoFile;
    let logoExt;
    if (logo !== null) {
      logoFile = Buffer.from(logo, 'base64');
      const fileType = await fileTypeFromBuffer(logoFile);
      if (!fileType) return -4;

      if (!(fileType && (fileType.ext === 'jpeg' || fileType.ext === 'jpg' || fileType.ext === 'png'))) return -4;
      if (file.byteLength > 1048576) return -5;
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
        if (file.byteLength > 1048576) return -7;
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
      if (file.byteLength > 1048576) return -9;
      image1Ext = fileType.ext;
    }

    let image2File;
    let image2Ext;
    if (image2 !== null) {
      image2File = Buffer.from(image2, 'base64');
      const fileType = await fileTypeFromBuffer(image2File);
      if (!fileType) return -10;

      if (!(fileType && (fileType.ext === 'jpeg' || fileType.ext === 'jpg' || fileType.ext === 'png'))) return -10;
      if (file.byteLength > 1048576) return -11;
      image2Ext = fileType.ext;
    }

    let image3File;
    let image3Ext;
    if (image3 !== null) {
      image3File = Buffer.from(image3, 'base64');
      const fileType = await fileTypeFromBuffer(image3File);
      if (!fileType) return -12;

      if (!(fileType && (fileType.ext === 'jpeg' || fileType.ext === 'jpg' || fileType.ext === 'png'))) return -12;
      if (file.byteLength > 1048576) return -13;
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
        if (file.byteLength > 3145728) return -15;
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
        if (file.byteLength > 3145728) return -17;
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
        if (file.byteLength > 3145728) return -19;
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
        { ...(id !== null ? { id } : {}), title, description, published: false, published_datetime: new Date() },
        { transaction }
      );

      const projectCategories = categories.map(categoryId => ({
        project_id: addDataProjectModel.dataValues.id,
        category_id: categoryId
      }));

      await this.ProjectCategoryModel.bulkCreate(projectCategories, {
        transaction
      });

      if (otherCtg !== null) {
        const getDataCategoryModel = await this.CategoryModel.findOne({
          where: { name: 'Other' },
          transaction
        });

        await this.ProjectCategoryModel.create(
          { project_id: addDataProjectModel.dataValues.id, category_id: getDataCategoryModel.dataValues.id },
          { transaction }
        );
      }

      const projectTags = tags.map((name) => {
        return {
          project_id: addDataProjectModel.dataValues.id,
          name
        }
      });

      await this.ProjectTagsModel.bulkCreate(projectTags, { transaction });

      if (logo) {
        const imagePath = '/server_data/project/logo/' + addDataProjectModel.dataValues.id + '.' + logoExt;

        this.server.FS.writeFileSync(process.cwd() + imagePath, logoFile);
        await this.ProjectModel.update({ logo_path: imagePath }, {
          where: { id: addDataProjectModel.dataValues.id },
          transaction
        });
      }

      if (thumbnail) {
        if (thumbnail.isUrl !== true) {
          const imagePath = '/server_data/project/thumbnail/' + addDataProjectModel.dataValues.id + '.' + thumbnailExt;

          this.server.FS.writeFileSync(process.cwd() + imagePath, thumbnailFile);
          await this.ProjectThumbnailModel.create(
            { project_id: addDataProjectModel.dataValues.id, method: 1, url: imagePath },
            { transaction }
          );
        } else {
          await this.ProjectThumbnailModel.create(
            { project_id: addDataProjectModel.dataValues.id, method: 2, url: thumbnail.data },
            { transaction }
          );
        }
      }

      if (image1) {
        const imagePath = '/server_data/project/preview/' + addDataProjectModel.dataValues.id + '-1.' + image1Ext;

        this.server.FS.writeFileSync(process.cwd() + imagePath, image1File);
        await this.ProjectPreviewModel.create(
          { project_id: addDataProjectModel.dataValues.id, sort: 1,  path: imagePath },
          { transaction }
        );
      }

      if (image2) {
        const imagePath = '/server_data/project/preview/' + addDataProjectModel.dataValues.id + '-2.' + image2Ext;

        this.server.FS.writeFileSync(process.cwd() + imagePath, image2Ext);
        await this.ProjectPreviewModel.create(
          { project_id: addDataProjectModel.dataValues.id, sort: 2,  path: imagePath },
          { transaction }
        );
      }

      if (image3) {
        const imagePath = '/server_data/project/preview/' + addDataProjectModel.dataValues.id + '-3.' + image3Ext;

        this.server.FS.writeFileSync(process.cwd() + imagePath, image3File);
        await this.ProjectPreviewModel.create(
          { project_id: addDataProjectModel.dataValues.id, sort: 3,  path: imagePath },
          { transaction }
        );
      }
      
      if (program) {
        if (program.isUrl !== true) {
          const filePath = '/server_data/project/files/' + addDataProjectModel.dataValues.id + '-1.' + programFileExt;

          this.server.FS.writeFileSync(process.cwd() + filePath, programFile);
          await this.ProjectFilesModel.create(
            { project_id: addDataProjectModel.dataValues.id, type: 1, method: 1, url: filePath },
            { transaction }
          );
        } else {
          await this.ProjectFilesModel.create(
            { project_id: addDataProjectModel.dataValues.id, type: 1, method: 2, url: program.data },
            { transaction }
          );
        }
      }

      if (paper) {
        if (paper.isUrl !== true) {
          const filePath = '/server_data/project/files/' + addDataProjectModel.dataValues.id + '-2.' + paperFileExt;

          this.server.FS.writeFileSync(process.cwd() + filePath, paperFile);
          await this.ProjectFilesModel.create(
            { project_id: addDataProjectModel.dataValues.id, type: 2, method: 1, url: filePath },
            { transaction }
          );
        } else {
          await this.ProjectFilesModel.create(
            { project_id: addDataProjectModel.dataValues.id, type: 2, method: 2, url: paper.data },
            { transaction }
          );
        }
      }

      if (code) {
        if (code.isUrl !== true) {
          const filePath = '/server_data/project/files/' + addDataProjectModel.dataValues.id + '-3.' + codeFileExt;

          this.server.FS.writeFileSync(process.cwd() + filePath, codeFile);
          await this.ProjectFilesModel.create(
            { project_id: addDataProjectModel.dataValues.id, type: 3, method: 1, url: filePath },
            { transaction }
          );
        } else {
          await this.ProjectFilesModel.create(
            { project_id: addDataProjectModel.dataValues.id, type: 3, method: 2, url: code.data },
            { transaction }
          );
        }
      }

      return 1;
    } catch (err) {
      return -500;
    }
  }

  // Draft Project Function Service
  async draftProject(reqData) {
    const getManageProject = await this.manageProject(reqData, false);
    return getManageProject;
  }

  // Publish Project Function Service
  async publishProject(reqData) {
    const getManageProject = await this.manageProject(reqData, true);
    return getManageProject;
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

  // For You Page Service
  async getForYou(offset, limit) {
    const getDataProjectModel = await this.ProjectModel.findAll({
      where: {
        published: true
      },
      order: [['published_datetime', 'DESC']],
      offset: (offset - 1) * limit,
      limit,
      attributes: [
        'id',
        ['user_id', 'owner_id'],
        'title',
        'description',
        ['logo_path', 'logo']
      ]
    });

    for(let i in getDataProjectModel) {
      const getDataUserModel = await this.UserModel.findOne({
        where: {
          id: getDataProjectModel[i].dataValues.owner_id
        }
      });
      getDataProjectModel[i].dataValues.owner_name = getDataUserModel.dataValues.name;
      getDataProjectModel[i].dataValues.owner_username = getDataUserModel.dataValues.username;
      getDataProjectModel[i].dataValues.owner_image = '/profile/get/photo/' + getDataProjectModel[i].dataValues.owner_id;


      if(getDataProjectModel[i].dataValues.logo) getDataProjectModel[i].dataValues.logo = '/project/get/logo/' + getDataProjectModel[i].dataValues.id;

      const getDataProjectContributorsModel = await this.ProjectContributorsModel.findAll({
        where: {
          project_id: getDataProjectModel[i].dataValues.id
        }
      });
      
      if(getDataProjectContributorsModel.length !== 0) {
        const getDataUserModel = await this.UserModel.findAll({
          where: {
            id: {
              [Op.in]: getDataProjectContributorsModel.map(val => val.dataValues.user_id)
            }
          }
        });

        getDataProjectModel[i].dataValues.contributors = getDataUserModel.map(val => {
          return {
            user_id: val.dataValues.id,
            name: val.dataValues.name,
            username: val.dataValues.username,
            image: '/profile/get/photo' + val.dataValues.id
          }
        });
      } else {
        getDataProjectModel[i].dataValues.contributors = null;
      }

      const getDataProjectCategoryModel = await this.ProjectCategoryModel.findAll({
        where: {
          project_id: getDataProjectModel[i].dataValues.id
        },
      });
      
      if(getDataProjectCategoryModel.length !== 0) {
        const getDataCategoryModel = await this.CategoryModel.findAll({
          where: {
            id: {
              [Op.in]: getDataProjectCategoryModel.map(val => val.dataValues.category_id)
            }
          }
        });

        for(let j in getDataCategoryModel) {
          if(getDataCategoryModel[j].dataValues.name === 'Other') {
            const indexOther = getDataProjectCategoryModel.findIndex(val => val.dataValues.category_id === getDataCategoryModel[j].dataValues.id);
            getDataCategoryModel[j].dataValues.name = getDataProjectCategoryModel[indexOther].dataValues.other;
          }
        }

        getDataProjectModel[i].dataValues.categories = getDataCategoryModel.map(val => val.dataValues.name);
      } else {
        getDataProjectModel[i].dataValues.categories = null;
      }

      const getDataProjectThumbnailModel = await this.ProjectThumbnailModel.findOne({
        project_id: getDataProjectModel[i].dataValues.id
      });
      
      if(getDataProjectThumbnailModel !== null) {
        getDataProjectModel[i].dataValues.thumbnail = {};

        if(getDataProjectThumbnailModel.dataValues.method === 1) {
          getDataProjectModel[i].dataValues.thumbnail.isUrl = false;
          getDataProjectModel[i].dataValues.thumbnail.data = '/project/get/thumbnail/' + getDataProjectModel[i].dataValues.id;
        } else {
          getDataProjectModel[i].dataValues.thumbnail.isUrl = true;
          getDataProjectModel[i].dataValues.thumbnail.data = getDataProjectThumbnailModel.dataValues.url;
        }
      } else {
        getDataProjectModel[i].dataValues.thumbnail = null;
      }
    }
    
    return getDataProjectModel;
  }

  async getCategoryProject() {
    const getDataCategoryModel = await this.CategoryModel.findAll({});
    
    return getDataCategoryModel;
  }

}

export default ProjectService;