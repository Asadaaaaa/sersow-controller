import UserModel from "../../models/User.model.js";
import VerifCodeModel from '../../models/VerifCode.model.js';

// Library
import JWT from 'jsonwebtoken';
import { customAlphabet } from 'nanoid';
import mailer from 'nodemailer';

class SettingsService {
  constructor(server) {
    this.server = server;

    this.UserModel = new UserModel(this.server).table;
    this.VerifCodeModel = new VerifCodeModel(this.server).table;

  }

  generateWithRefreshToken(userId) {
    const idGen = customAlphabet('1234567890', 10);
    const tokenId = idGen();
    const token = JWT.sign(
      {
        tokenId,
        userId
      },
      this.server.env.JWT_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    return {
      token,
      refreshToken: JWT.sign(
        {
          tokenId,
          userId,
          refreshToken: true
        },
        this.server.env.JWT_TOKEN_SECRET
      )
    }
  }

  async accountUpdateUsername(userId, username) {
    const getDataUserModel = await this.UserModel.findOne({
      where: { id: userId },
      attributes: [
        'id',
        'username',
      ],
    });

    if(getDataUserModel === null) return -1;
    if(getDataUserModel.dataValues.username === username) return -2;

    await this.UserModel.update({ username }, { where: { id: userId } });

    return 1;
  }

  async accountAddEmail(userId, email_gmail) {
    const getDataUserModel = await this.UserModel.findOne({
      where: { id: userId },
      attributes: [
        'id',
        'email_gmail',
      ],
    });
    // console.log(getDataUserModel.dataValues());
    if(getDataUserModel === null) return -1;
    if(getDataUserModel.dataValues.email_gmail  && getDataUserModel.dataValues.verif_email_gmail === true) return -2;

    await this.UserModel.update({ email_gmail }, { where: { id: userId } });

    this.sendVerificationCode(userId);

    return 1;
  }

  async sendVerificationCode(userId) {
    const userModelData = await this.UserModel.findOne({
      where: {
        id: userId
      }
    });

    if(userModelData === null) return -1;
    if(userModelData !== null && userModelData.verif_email === true) return -2;

    const verifCodeModelData = await this.VerifCodeModel.findOne({
      where: {
        user_id: userId
      },
      order: [
        ['createdAt', 'DESC']
      ]
    });

    if(verifCodeModelData !== null) {
      if((new Date().getTime() - new Date(verifCodeModelData.dataValues.createdAt).getTime()) < 25000) return -3;
    }

    const codeGen = customAlphabet('1234567890', 6);
    const verifCode = codeGen();

    await this.VerifCodeModel.create({ user_id: userId, code: verifCode, createdAt: new Date() });
    
    const transporter = mailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: this.server.env.MAIL_EMAIL,
        pass: this.server.env.MAIL_ETHEREAL_PASSWORD,
      },
    });

    transporter.sendMail({
      from: '"Sersow" <sersow.verify@gmail.com>',
      to: userModelData.dataValues.email_gmail,
      subject: "Sersow - Registration Verification",
      text: "" + 
      "Dear " + userModelData.dataValues.name + ",\n\n" +
      "Thank you for registering to Sersow! As a security measure, we require you to verify your account by entering the following code below\n\n" +
      "Verification Code: " + verifCode + "\n\n" +
      "Please keep this code private and do not share it with anyone. This is a confidential verification process to ensure the security of your account.\n\n" +
      "Thank you for choosing Sersow, we are excited to have you as part of our community!\n\n" +
      "Best regards, Sersow Team."
    });

    return;
  }
  
  async validationVerificationCode(userId, code) {
    const verifCodeModelData = await this.VerifCodeModel.findOne({
      where: {
        user_id: userId,
        code
      }
    });

    if(verifCodeModelData === null) return -1;

    const timeDiff = new Date().getTime() - new Date(verifCodeModelData.dataValues.createdAt).getTime()

    if((timeDiff / (1000 * 60)) > 10) return -2;

    await this.UserModel.update({
      verif_email_gmail: true,
    }, {
      where: {
        id: userId
      }
    });
    await this.VerifCodeModel.destroy({ where: { user_id: userId } });

    return this.generateWithRefreshToken(userId);
  }
}

export default SettingsService;