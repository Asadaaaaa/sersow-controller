import UserModel from '../../models/User.model.js';
import VerifCodeModel from '../../models/VerifCode.model.js';

// Library
import JWT from 'jsonwebtoken';
import md5 from 'md5';
import { customAlphabet } from 'nanoid';
import mailer from 'nodemailer';

class Auth {
  constructor(server) {
    this.server = server;
    this.UserModel = new UserModel(this.server).table;
    this.VerifCodeModel = new VerifCodeModel(this.server).table;
  }

  generateToken(userId, notVerified) { 
    const idGen = customAlphabet('1234567890', 10);
    
    return JWT.sign(
      {
        tokenId: idGen(),
        userId,
        ...(notVerified === true ? { notVerified } : {})
      },
      this.server.env.JWT_TOKEN_SECRET,
      { expiresIn: '1h' }
    )
  }

  async register(emailUpi, name, gender, password) {
    const userModelData = await this.UserModel.findOne({
      where: {
        email_upi: emailUpi
      }
    });
    
    if(userModelData !== null && userModelData.verif_email_upi === true) return -1;

    name = name.toUpperCase();
    password = md5(password + '-' + this.server.env.HASH_SALT);
    const usernameGen = customAlphabet('abcdefghijklmnopqrstuvwxyz', 10);
    
    const resUserUpdateModel = await this.UserModel.upsert({
      ...(userModelData !== null ? {id: userModelData.dataValues.id} : {}),
      ...(userModelData !== null ? {username: userModelData.dataValues.username} : {username: usernameGen()}),
      email_upi: emailUpi,
      name,
      gender,
      password,
      createdAt: new Date()
    });

    this.sendVerificationCode(resUserUpdateModel[0].dataValues.id);

    return this.generateToken(resUserUpdateModel[0].dataValues.id, true);
  }

  async login(identity, password) {
    const userModelData = await this.UserModel.findOne({
      where: {
        ...(identity.endsWith('@upi.edu') ? { email_upi: identity } : identity.endsWith('@gmail.com') ? { email_gmail: identity } : { username: identity }),
        password: md5(password + '-' + this.server.env.HASH_SALT)
      }
    });
    
    if(userModelData === null) return -1;

    return this.generateToken(userModelData.dataValues.id);
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

    await this.UserModel.update({ verif_email_upi: true }, {
      where: {
        id: userId
      }
    });
    await this.VerifCodeModel.destroy({ where: { user_id: userId } });

    return this.generateToken(userId);
  }

  async sendVerificationCode(userId) {
    const userModelData = await this.UserModel.findOne({
      where: {
        id: userId
      }
    });

    if(userModelData === null) return -1;
    if(userModelData !== null && userModelData.verif_email_upi === true) return -2;

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
      to: userModelData.dataValues.email_upi,
      subject: "Sersow Verification Code",
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

  async reqForgetPassword(email) {
    const userModelData = await this.UserModel.findOne({
      where: {
        ...(email.endsWith('@upi.edu') ? { email_upi: email } : email.endsWith('@gmail.com') ? { email_gmail: email } : { id: null })
      }
    });

    if(userModelData === null) return -1;
    
  }
}

export default Auth;