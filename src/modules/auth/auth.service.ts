import { Injectable } from '@nestjs/common';
import { MailService } from '../supporting-modules/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  VerifyOtpDto,
  LoginDto,
  SSOLoginDto,
  NewAccessTokenDto,
  ForgotPasswordDto,
  ForgotPasswordVerifyEmailDto,
} from './dto/create.dto';
import * as bcrypt from 'bcryptjs';
import { Blacklist } from './entities/blacklist.entity';
import { otpGenerator, sixDigitGenerator } from '../../common/generator';
import { extractUsername, validateEmail, validatePhoneNumber } from '../../common/common';
import { Buyer } from '../users/buyer/entities/buyer.entity';
import { Seller } from '../users/seller/entities/seller.entity';
import { Admin } from '../users/admin/entities/admin.entity';
import { FirmService } from '../firm/firm.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtSvc: JwtService,
    private mailService: MailService,
    private configSvc: ConfigService,
    private firmService: FirmService,
    @InjectRepository(Buyer)
    private readonly buyerRepository: Repository<Buyer>,
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Blacklist)
    private readonly blackListRepository: Repository<Blacklist>,
  ) { }

  #createOtpToken(user: any) {
    let accessToken = this.jwtSvc.sign(user, {
      secret: this.configSvc.get<string>('JWT_SECRET'),
      expiresIn: `${this.configSvc.get<number>('JWT_OTP_TOKEN_EXPIRY_TIME')}m`,
    });
    this.jwtSvc.decode;
    return accessToken;
  }
  #createJwtAccessToken(user: any) {
    return this.jwtSvc.sign(
      { user },
      {
        secret: this.configSvc.get<string>('JWT_SECRET'),
        expiresIn: `${this.configSvc.get<number>('JWT_ACCESS_TOKEN_EXPIRY_TIME')}d`,
      },
    );
  }
  #createJwtRefreshToken(user: any) {
    return this.jwtSvc.sign(
      { user },
      {
        secret: this.configSvc.get<string>('JWT_SECRET'),
        expiresIn: `${this.configSvc.get<number>('JWT_REFRESH_TOKEN_EXPIRY_TIME')}d`,
      },
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async sendOtp(sendOtpDto: any): Promise<any> {
    let type = sendOtpDto?.type;
    let authType = sendOtpDto?.authType;
    if (!type) {
      throw new Error("Invalid User Type");
    }

    if (authType === "email") {
      let userDetails: any;
      if (!validateEmail(sendOtpDto.email)) {
        throw new Error("Invalid Email Id");
      }

      // if (type === "buyer") {
      //   userDetails = await this.buyerRepository.findOne({
      //     where: {
      //       email: sendOtpDto.email,
      //       deleteFlag: false,
      //     },
      //   });
      // } else if (type === "seller") {
      //   userDetails = await this.sellerRepository.findOne({
      //     where: {
      //       email: sendOtpDto.email,
      //       deleteFlag: false,
      //     },
      //   });
      // } else {
      //   throw new Error('Invalid user type...!');
      // }

      // if (userDetails) {
      //   throw new Error('User with this email already exist, please login...!');
      // } else {
      let otp: any = otpGenerator();
      await this.mailService.sendOTP({ email: sendOtpDto.email, otp });
      let hashedOtp = await bcrypt.hash(otp, 8);
      if (process.env.OTP_PHASE === "testing") {
        return {
          otp,
          otpToken: this.#createOtpToken({ hashedOtp, ...sendOtpDto }),
        };
      } else {
        return {
          otpToken: this.#createOtpToken({ hashedOtp, ...sendOtpDto }),
        };
      }
      // }
    } else {
      let userDetails: any;
      if (!validatePhoneNumber(sendOtpDto.phone)) {
        throw new Error("Invalid Phone Number");
      }
      // if (type === "buyer") {
      //   userDetails = await this.buyerRepository.findOne({
      //     where: {
      //       phone: sendOtpDto.phone,
      //       deleteFlag: false,
      //     },
      //   });
      // } else if (type === "seller") {
      //   userDetails = await this.sellerRepository.findOne({
      //     where: {
      //       phone: sendOtpDto.phone,
      //       deleteFlag: false,
      //     },
      //   });
      // } else {
      //   throw new Error('Invalid user type...!');
      // }

      // if (userDetails) {
      //   throw new Error('User with this phone number already exist, please login...!');
      // } else {
      let otp: any = otpGenerator();
      // await this.mailService.sendOTP({ email: sendOtpDto.email, otp }); // TODO instead of this add phone service
      let hashedOtp = await bcrypt.hash(otp, 8);
      if (process.env.OTP_PHASE === "testing") {
        return {
          otp,
          otpToken: this.#createOtpToken({ hashedOtp, ...sendOtpDto }),
        };
      } else {
        return {
          otpToken: this.#createOtpToken({ hashedOtp, ...sendOtpDto }),
        };
      }
      // }
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<any> {
    let verify = await this.jwtSvc.decode(verifyOtpDto.otpToken);
    let type = verify?.type;
    let authType = verify?.authType;
    if (!verify) throw new Error('OTP is expired...!');
    let otpIsValid = await bcrypt.compare(verifyOtpDto.otp, verify.hashedOtp);
    if (!otpIsValid) throw new Error('OTP is not valid...!');

    let userDetails: any;
    if (type === "buyer") {
      if (authType === "email") {
        userDetails = await this.buyerRepository.findOne({
          where: { email: verify?.email, deleteFlag: false },
          relations: ["firm.category"]
        });
      } else if (authType === "phone") {
        userDetails = await this.buyerRepository.findOne({
          where: { phone: verify?.phone, deleteFlag: false },
          relations: ["firm.category"]
        });
      } else {
        throw new Error('Invalid auth type...!');
      }
    } else if (type === "seller") {
      if (authType === "email") {
        userDetails = await this.sellerRepository.findOne({
          where: { email: verify?.email, deleteFlag: false },
          relations: ["firm.category"]
        });
      } else if (authType === "phone") {
        userDetails = await this.sellerRepository.findOne({
          where: { phone: verify?.phone, deleteFlag: false },
          relations: ["firm.category"]
        });
      } else {
        throw new Error('Invalid auth type...!');
      }
    }
    if (userDetails) {
      let accessToken = this.#createJwtAccessToken({ ...userDetails, type });
      let refreshToken = this.#createJwtRefreshToken({ ...userDetails, type });
      delete userDetails.password;
      delete userDetails.activeFlag;
      delete userDetails.deleteFlag;
      return { ...userDetails, accessToken, refreshToken, isNewUser: false };
    } else {
      let user: any = {
        email: verify?.email || "",
        phone: verify?.phone || "",
      };
      if (type === "buyer") {
        userDetails = await this.buyerRepository.save(user);
      } else if (type === "seller") {
        let firm: any = await this.firmService.create({ name: "Firm ABC" });
        firm.category = [];
        user.firm = firm;
        userDetails = await this.sellerRepository.save(user);
      } else {
        throw new Error('Invalid user type...!');
      }
      let accessToken = this.#createJwtAccessToken({ ...userDetails, type });
      let refreshToken = this.#createJwtRefreshToken({ ...userDetails, type });
      delete userDetails.password;
      delete userDetails.activeFlag;
      delete userDetails.deleteFlag;
      return { ...userDetails, accessToken, refreshToken, isNewUser: true };
    }

  }

  async sendOtpAdmin(sendOtpDto: any): Promise<any> {
    let authType = sendOtpDto?.authType;
    if (authType === "email") {
      if (!validateEmail(sendOtpDto.email)) {
        throw new Error("Invalid Email Id");
      }

      // let userDetails = await this.adminRepository.findOne({
      //   where: {
      //     email: sendOtpDto.email,
      //     deleteFlag: false,
      //   },
      // });

      // if (userDetails) {
      //   throw new Error('User with this email already exist, please login...!');
      // } else {
      let otp: any = otpGenerator();
      await this.mailService.sendOTP({ email: sendOtpDto.email, otp });
      let hashedOtp = await bcrypt.hash(otp, 8);
      if (process.env.OTP_PHASE === "testing") {
        return {
          otp,
          otpToken: this.#createOtpToken({ hashedOtp, ...sendOtpDto }),
        };
      } else {
        return {
          otpToken: this.#createOtpToken({ hashedOtp, ...sendOtpDto }),
        };
      }
      // }
    } else {
      if (!validatePhoneNumber(sendOtpDto.phone)) {
        throw new Error("Invalid Phone Number");
      }

      // let userDetails = await this.adminRepository.findOne({
      //   where: {
      //     phone: sendOtpDto.phone,
      //     deleteFlag: false,
      //   },
      // });

      // if (userDetails) {
      //   throw new Error('User with this phone number already exist, please login...!');
      // } else {
      let otp: any = otpGenerator();
      // await this.mailService.sendOTP({ email: sendOtpDto.email, otp }); // TODO instead of this add phone service
      let hashedOtp = await bcrypt.hash(otp, 8);
      if (process.env.OTP_PHASE === "testing") {
        return {
          otp,
          otpToken: this.#createOtpToken({ hashedOtp, ...sendOtpDto }),
        };
      } else {
        return {
          otpToken: this.#createOtpToken({ hashedOtp, ...sendOtpDto }),
        };
      }
      // }
    }
  }

  async verifyOtpAdmin(verifyOtpDto: VerifyOtpDto): Promise<any> {
    let verify = await this.jwtSvc.decode(verifyOtpDto.otpToken);
    if (!verify) throw new Error('OTP is expired...!');
    let otpIsValid = await bcrypt.compare(verifyOtpDto.otp, verify.hashedOtp);
    if (!otpIsValid) throw new Error('OTP is not valid...!');
    let authType = verify?.authType;
    let userDetails: any;

    if (authType === "email") {
      userDetails = await this.adminRepository.findOne({
        where: { email: verify?.email, deleteFlag: false },
      });
    } else if (authType === "phone") {
      userDetails = await this.adminRepository.findOne({
        where: { phone: verify?.phone, deleteFlag: false },
      });
    } else {
      throw new Error('Invalid auth type...!');
    }

    if (userDetails) {
      let accessToken = this.#createJwtAccessToken({ ...userDetails, type: "admin" });
      let refreshToken = this.#createJwtRefreshToken({ ...userDetails, type: "admin" });
      delete userDetails.password;
      delete userDetails.activeFlag;
      delete userDetails.deleteFlag;
      return { ...userDetails, accessToken, refreshToken, isNewUser: false };
    } else {

      let user: any = {
        email: verify?.email || "",
        phone: verify?.phone || "",
      };
      userDetails = await this.adminRepository.save(user);
      let accessToken = this.#createJwtAccessToken({ ...userDetails, type: "admin" });
      let refreshToken = this.#createJwtRefreshToken({ ...userDetails, type: "admin" });
      delete userDetails.password;
      delete userDetails.activeFlag;
      delete userDetails.deleteFlag;
      return { ...userDetails, accessToken, refreshToken, isNewUser: true };
    }
  }

  async login(loginDto: LoginDto): Promise<any> {
    let userDetails: any;
    let type = loginDto?.type;
    let usernameOrEmail: string = loginDto.user;
    if (type === "buyer") {
      userDetails = await this.buyerRepository
        .createQueryBuilder('userDetails')
        .where('userDetails.username = :usernameOrEmail', { usernameOrEmail })
        .orWhere('userDetails.email = :usernameOrEmail', { usernameOrEmail })
        .andWhere('userDetails.deleteFlag = :deleteFlag', { deleteFlag: false })
        .andWhere('userDetails.ssoLogin = :ssoLogin', { ssoLogin: false })
        .getOne();
    } else if (type === "seller") {
      userDetails = await this.sellerRepository
        .createQueryBuilder('userDetails')
        .where('userDetails.username = :usernameOrEmail', { usernameOrEmail })
        .orWhere('userDetails.email = :usernameOrEmail', { usernameOrEmail })
        .andWhere('userDetails.deleteFlag = :deleteFlag', { deleteFlag: false })
        .andWhere('userDetails.ssoLogin = :ssoLogin', { ssoLogin: false })
        .getOne();
    } else {
      throw new Error('Invalid user type...!');
    }

    if (!userDetails) throw new Error('Incorrect username/email');
    let match = await bcrypt.compare(loginDto.password, userDetails.password);
    if (!match) throw new Error('Incorrect password');
    let accessToken = this.#createJwtAccessToken({ ...userDetails, type });
    let refreshToken = this.#createJwtRefreshToken({ ...userDetails, type });
    delete userDetails.password;
    delete userDetails.activeFlag;
    delete userDetails.deleteFlag;
    return { ...userDetails, accessToken, refreshToken, isNewUser: false };
  }

  async loginAdmin(loginDto: LoginDto): Promise<any> {
    let usernameOrEmail: string = loginDto.user;
    let userDetails = await this.adminRepository
      .createQueryBuilder('userDetails')
      .where('userDetails.username = :usernameOrEmail', { usernameOrEmail })
      .orWhere('userDetails.email = :usernameOrEmail', { usernameOrEmail })
      .andWhere('userDetails.deleteFlag = :deleteFlag', { deleteFlag: false })
      .andWhere('userDetails.ssoLogin = :ssoLogin', { ssoLogin: false })
      .getOne();

    if (!userDetails) throw new Error('Incorrect username/email');
    let match = await bcrypt.compare(loginDto.password, userDetails.password);
    if (!match) throw new Error('Incorrect password');
    let accessToken = this.#createJwtAccessToken({ ...userDetails, type: "admin" });
    let refreshToken = this.#createJwtRefreshToken({ ...userDetails, type: "admin" });
    delete userDetails.password;
    delete userDetails.activeFlag;
    delete userDetails.deleteFlag;
    return { ...userDetails, accessToken, refreshToken, isNewUser: false };
  }

  async ssoLogin(ssoLoginDto: SSOLoginDto): Promise<any> {
    let type = ssoLoginDto.type;
    if (!type) {
      throw new Error("Invalid type");
    }
    if (type === "buyer") {
      let userDetails = await this.buyerRepository.findOne({
        where: { email: ssoLoginDto.email, deleteFlag: false },
        relations: ["firm.category"]
      });
      if (userDetails) {
        let accessToken = this.#createJwtAccessToken({ ...userDetails, type });
        let refreshToken = this.#createJwtRefreshToken({ ...userDetails, type });
        delete userDetails.password;
        delete userDetails.activeFlag;
        delete userDetails.deleteFlag;
        return { ...userDetails, accessToken, refreshToken, isNewUser: false };
      } else {
        let username = extractUsername(ssoLoginDto.email);
        let userWithUsername = await this.buyerRepository.findOne({
          where: { username, deleteFlag: false },
        });
        username = userWithUsername
          ? `${username}${sixDigitGenerator()}`
          : username;
        let user: any = {
          email: ssoLoginDto.email,
          fullName: ssoLoginDto.fullName,
          username,
          avatar: ssoLoginDto.picture,
          ssoLogin: true,
        };
        let userDetails = await this.buyerRepository.save(user);
        let accessToken = this.#createJwtAccessToken({ ...userDetails, type });
        let refreshToken = this.#createJwtRefreshToken({ ...userDetails, type });
        delete userDetails.password;
        delete userDetails.activeFlag;
        delete userDetails.deleteFlag;
        return { ...userDetails, accessToken, refreshToken, isNewUser: true };
      }
    } else if (type === "seller") {
      let userDetails = await this.sellerRepository.findOne({
        where: { email: ssoLoginDto.email, deleteFlag: false },
        relations: ["firm.category"]
      });
      if (userDetails) {
        let accessToken = this.#createJwtAccessToken({ ...userDetails, type });
        let refreshToken = this.#createJwtRefreshToken({ ...userDetails, type });
        delete userDetails.password;
        delete userDetails.activeFlag;
        delete userDetails.deleteFlag;
        return { ...userDetails, accessToken, refreshToken, isNewUser: false };
      } else {
        let username = extractUsername(ssoLoginDto.email);
        let userWithUsername = await this.sellerRepository.findOne({
          where: { username, deleteFlag: false },
        });
        username = userWithUsername
          ? `${username}${sixDigitGenerator()}`
          : username;
        let firm: any = await this.firmService.create({ name: "Firm ABC" });
        firm.category = [];
        let user: any = {
          email: ssoLoginDto.email,
          fullName: ssoLoginDto.fullName,
          username,
          avatar: ssoLoginDto.picture,
          ssoLogin: true,
          firm,
        };
        let userDetails = await this.sellerRepository.save(user);
        let accessToken = this.#createJwtAccessToken({ ...userDetails, type });
        let refreshToken = this.#createJwtRefreshToken({ ...userDetails, type });
        delete userDetails.password;
        delete userDetails.activeFlag;
        delete userDetails.deleteFlag;
        return { ...userDetails, accessToken, refreshToken, isNewUser: true };
      }
    } else {
      throw new Error('Invalid user type...!');
    }

  }

  async ssoLoginAdmin(ssoLoginDto: any): Promise<any> {
    let userDetails = await this.adminRepository.findOne({
      where: { email: ssoLoginDto.email, deleteFlag: false, ssoLogin: true },
    });
    if (userDetails) {
      let accessToken = this.#createJwtAccessToken({ ...userDetails, type: "admin" });
      let refreshToken = this.#createJwtRefreshToken({ ...userDetails, type: "admin" });
      delete userDetails.password;
      delete userDetails.activeFlag;
      delete userDetails.deleteFlag;
      return { ...userDetails, accessToken, refreshToken, isNewUser: false };
    } else {
      let username = extractUsername(ssoLoginDto.email);
      let userWithUsername = await this.adminRepository.findOne({
        where: { username, deleteFlag: false },
      });
      username = userWithUsername
        ? `${username}${sixDigitGenerator()}`
        : username;
      let user: any = {
        email: ssoLoginDto.email,
        fullName: ssoLoginDto.fullName,
        username,
        avatar: ssoLoginDto.picture,
        ssoLogin: true,
      };
      let userDetails = await this.adminRepository.save(user);
      let accessToken = this.#createJwtAccessToken({ ...userDetails, type: "admin" });
      let refreshToken = this.#createJwtRefreshToken({ ...userDetails, type: "admin" });
      delete userDetails.password;
      delete userDetails.activeFlag;
      delete userDetails.deleteFlag;
      return { ...userDetails, accessToken, refreshToken, isNewUser: true };
    }
  }

  async newAccessToken(newAccessTokenDto: NewAccessTokenDto): Promise<any> {
    let verify = await this.jwtSvc.decode(newAccessTokenDto.refreshToken);
    if (!verify) throw new Error('Invalid refresh token');
    let existingRefreshToken = await this.blackListRepository.findOne({
      where: { refreshToken: newAccessTokenDto.refreshToken },
    });
    if (existingRefreshToken) throw new Error('Refresh Token is expired');
    await this.blackListRepository.save(newAccessTokenDto);
    let accessToken = this.#createJwtAccessToken(verify);
    let refreshToken = this.#createJwtRefreshToken(verify);
    return { accessToken, refreshToken };
  }

  async sendOtpForgotPassword(
    forgotPasswordVerifyEmailDto: ForgotPasswordVerifyEmailDto,
  ): Promise<any> {
    let userDetails = await this.buyerRepository.findOne({
      where: {
        email: forgotPasswordVerifyEmailDto.email,
        deleteFlag: false,
        ssoLogin: false,
      },
    });
    if (!userDetails)
      throw new Error('Invalid User/Email or User may be deleted...!');
    let otp: any = otpGenerator();
    await this.mailService.sendOTP({
      email: forgotPasswordVerifyEmailDto.email,
      otp,
    });
    let hashedOtp = await bcrypt.hash(otp, 8);
    return {
      otp,
      otpToken: this.#createOtpToken({
        hashedOtp,
        ...forgotPasswordVerifyEmailDto,
      }),
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    let verify = await this.jwtSvc.decode(forgotPasswordDto.otpToken);
    if (!verify) throw new Error('OTP is expired...!');
    let otpIsValid = await bcrypt.compare(
      forgotPasswordDto.otp,
      verify.hashedOtp,
    );
    if (!otpIsValid) throw new Error('OTP is not valid...!');
    let userDetails = await this.buyerRepository.findOne({
      where: { email: verify.email, deleteFlag: false },
    });
    if (!userDetails)
      throw new Error('Invalid User or User may be deleted...!');
    let password = await bcrypt.hash(forgotPasswordDto.password, 8);
    await this.buyerRepository.update(userDetails.id, { password });
    let accessToken = this.#createJwtAccessToken(userDetails);
    let refreshToken = this.#createJwtRefreshToken(userDetails);
    delete userDetails.password;
    return { ...userDetails, accessToken, refreshToken };
  }
}
