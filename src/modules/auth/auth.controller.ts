import { Body, Controller, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  VerifyOtpDto,
  LoginDto,
  SSOLoginDto,
  NewAccessTokenDto,
  ForgotPasswordDto,
  ForgotPasswordVerifyEmailDto,
} from "./dto/create.dto";
import { Response } from "express";
import { RoutesConstants } from "../../constants/routes.constant";
import { errorResponse, successResponse } from "../../base/response";
import { AllowWithoutSubscription } from "./allow-without-subscription.decorator";

@Controller(RoutesConstants.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(RoutesConstants.SEND_OTP)
  @AllowWithoutSubscription()
  async sendOtp(
    @Res() response: Response,
    @Body() sendOtpDto: any,
  ): Promise<void> {
    try {
      let result = await this.authService.sendOtp(sendOtpDto);
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Post(RoutesConstants.VERIFY_OTP)
  @AllowWithoutSubscription()
  async verifyOtp(
    @Res() response: Response,
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<void> {
    try {
      successResponse(response, await this.authService.verifyOtp(verifyOtpDto));
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Post(RoutesConstants.SEND_OTP_ADMIN)
  @AllowWithoutSubscription()
  async sendOtpAdmin(
    @Res() response: Response,
    @Body() sendOtpDto: any,
  ): Promise<void> {
    try {
      let result = await this.authService.sendOtpAdmin(sendOtpDto);
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Post(RoutesConstants.VERIFY_OTP_ADMIN)
  @AllowWithoutSubscription()
  async verifyOtpAdmin(
    @Res() response: Response,
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<void> {
    try {
      successResponse(
        response,
        await this.authService.verifyOtpAdmin(verifyOtpDto),
      );
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Post(RoutesConstants.LOGIN)
  @AllowWithoutSubscription()
  async login(
    @Res() response: Response,
    @Body() loginDto: LoginDto,
  ): Promise<void> {
    try {
      successResponse(response, await this.authService.login(loginDto));
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Post(RoutesConstants.LOGIN_ADMIN)
  @AllowWithoutSubscription()
  async loginAdmin(
    @Res() response: Response,
    @Body() loginDto: LoginDto,
  ): Promise<void> {
    try {
      successResponse(response, await this.authService.loginAdmin(loginDto));
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Post(RoutesConstants.SSO_LOGIN)
  @AllowWithoutSubscription()
  async ssoLogin(
    @Res() response: Response,
    @Body() ssoLoginDto: SSOLoginDto,
  ): Promise<void> {
    try {
      successResponse(response, await this.authService.ssoLogin(ssoLoginDto));
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Post(RoutesConstants.SSO_LOGIN_ADMIN)
  @AllowWithoutSubscription()
  async ssoLoginAdmin(
    @Res() response: Response,
    @Body() ssoLoginDto: any,
  ): Promise<void> {
    try {
      successResponse(
        response,
        await this.authService.ssoLoginAdmin(ssoLoginDto),
      );
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Post(RoutesConstants.NEW_ACCESS_TOKEN)
  @AllowWithoutSubscription()
  async newAccessToken(
    @Res() response: Response,
    @Body() newAccessTokenDto: NewAccessTokenDto,
  ): Promise<void> {
    try {
      successResponse(
        response,
        await this.authService.newAccessToken(newAccessTokenDto),
      );
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Post(RoutesConstants.FORGOT_PASSWORD_SEND_OTP)
  @AllowWithoutSubscription()
  async sendOtpForgotPassword(
    @Res() response: Response,
    @Body() forgotPasswordVerifyEmailDto: ForgotPasswordVerifyEmailDto,
  ): Promise<void> {
    try {
      successResponse(
        response,
        await this.authService.sendOtpForgotPassword(
          forgotPasswordVerifyEmailDto,
        ),
      );
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Post(RoutesConstants.FORGOT_PASSWORD)
  @AllowWithoutSubscription()
  async forgotPassword(
    @Res() response: Response,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
    try {
      successResponse(
        response,
        await this.authService.forgotPassword(forgotPasswordDto),
      );
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Post(RoutesConstants.VERIFIED_PHONE_LOGIN)
  @AllowWithoutSubscription()
  async verifiedPhoneLogin(
    @Res() response: Response,
    @Body() ssoLoginDto: any,
  ): Promise<void> {
    try {
      successResponse(
        response,
        await this.authService.verifiedPhoneLogin(ssoLoginDto),
      );
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Post(RoutesConstants.VERIFIED_PHONE_LOGIN_ADMIN)
  @AllowWithoutSubscription()
  async verifiedPhoneLoginAdmin(
    @Res() response: Response,
    @Body() ssoLoginDto: any,
  ): Promise<void> {
    try {
      successResponse(
        response,
        await this.authService.verifiedPhoneLoginAdmin(ssoLoginDto),
      );
    } catch (error: any) {
      errorResponse(response, error);
    }
  }
}
