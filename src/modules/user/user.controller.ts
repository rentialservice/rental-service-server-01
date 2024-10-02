import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { ChangePasswordDto, PasswordDto, UsernameDto } from './dto/update.dto';
import { RoutesConstants } from '../../constants/routes.constant';
import {
  errorResponse,
  successPaginatedResponse,
  successResponse,
} from '../../base/response';

@Controller(RoutesConstants.USER)
export class UserController {
  constructor(private readonly userService: UserService) { }

  // @UseGuards(JwtAuthGuard)
  @Get(RoutesConstants.GET_ALL_USER)
  async getAll(
    @Res() response: Response,
    @Query(RoutesConstants.PAGE) page: number = 1,
    @Query(RoutesConstants.PAGESIZE) pageSize: number = 10,
  ): Promise<void> {
    try {
      let { result, count } = await this.userService.getAll(page, pageSize);
      successPaginatedResponse(response, result, count, page, pageSize);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(RoutesConstants.GET_USER_DETAILS)
  async getById(
    @Req() request: Request,
    @Res() response: Response,
    @Query(RoutesConstants.ID) id: string,
  ): Promise<void> {
    try {
      let result = await this.userService.getById(
        id || (request.user as any).id,
        (request.user as any).id,
      );
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(RoutesConstants.GET_USER_BY_USERNAME)
  async getByUsername(
    @Req() request: Request,
    @Res() response: Response,
    @Query(RoutesConstants.USERNAME) username: string,
  ): Promise<void> {
    try {
      let result = await this.userService.getByUsername(
        username,
        (request.user as any).id,
      );
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(RoutesConstants.UPDATE_USER_DETAILS)
  async updateById(
    @Req() request: Request,
    @Res() response: Response,
    @Query(RoutesConstants.ID) id: string,
    @Body() updateUserDto: any,
  ): Promise<void> {
    try {
      let result = await this.userService.updateById(
        id || (request.user as any).id,
        updateUserDto,
      );
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(RoutesConstants.ACTION)
  async updateActionById(
    @Req() request: Request,
    @Res() response: Response,
    @Query(RoutesConstants.ID) id: string,
    @Query(RoutesConstants.ACTION) action: string,
  ): Promise<void> {
    try {
      let result = await this.userService.updateActionById(
        id || (request.user as any).id,
        action,
      );
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(RoutesConstants.SET_PASSWORD)
  async setPassword(
    @Req() request: Request,
    @Res() response: Response,
    @Query(RoutesConstants.ID) id: string,
    @Body() passwordDto: PasswordDto,
  ): Promise<void> {
    try {
      let result = await this.userService.setPassword(
        id || (request.user as any).id,
        passwordDto,
      );
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(RoutesConstants.CHECK_USERNAME)
  async checkUsername(
    @Req() request: Request,
    @Res() response: Response,
    @Body() usernameDto: UsernameDto,
  ): Promise<void> {
    try {
      let result = await this.userService.checkUsername(
        usernameDto,
        (request.user as any).id,
      );
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(RoutesConstants.CHANGE_PASSWORD)
  async changePassword(
    @Req() request: Request,
    @Res() response: Response,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    try {
      let result = await this.userService.changePassword(
        (request.user as any).id,
        changePasswordDto,
      );
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

}
