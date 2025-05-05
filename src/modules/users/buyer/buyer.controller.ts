import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Request, Response } from "express";
import { JwtAuthGuard } from "../../auth/jwt.auth.guard";
import { RoutesConstants } from "../../../constants/routes.constant";
import {
  errorResponse,
  successPaginatedResponse,
  successResponse,
} from "../../../base/response";
import { BuyerService } from "./buyer.service";
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller("buyer")
export class BuyerController {
  constructor(private readonly service: BuyerService) {}

  // @UseGuards(JwtAuthGuard)
  @Get(RoutesConstants.GET_ALL_USER)
  async getAll(
    @Req() request: Request,
    @Res() response: Response,
    @Query(RoutesConstants.PAGE) page: number = 1,
    @Query(RoutesConstants.PAGESIZE) pageSize: number = 10,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      let [users, count] = await this.service.getAll(
        page,
        pageSize,
        filterType,
        request.query,
      );
      successPaginatedResponse(response, users, count, page, pageSize);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Get("/filter")
  async filterGet(
    @Req() request: Request,
    @Res() response: Response,
    @Query(RoutesConstants.PAGE) page: number = 1,
    @Query(RoutesConstants.PAGESIZE) pageSize: number = 10,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      const [users, count]: any = await this.service.filter(
        request.query,
        [],
        page,
        pageSize,
        filterType,
      );
      successPaginatedResponse(response, users, count, page, pageSize);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Post()
  @UseInterceptors(FilesInterceptor("documents", 10))
  async create(
    @Req() request: Request,
    @Res() response: Response,
    @Body() createObject: any,
    @UploadedFiles() documents: Express.Multer.File[],
  ): Promise<void> {
    try {
      let result = await this.service.create(
        createObject,
        request.query,
        documents,
      );
      successResponse(response, result);
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
      let result = await this.service.getById(
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
      let result = await this.service.getByUsername(
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
  @UseInterceptors(FilesInterceptor("documents", 10))
  async updateById(
    @Req() request: Request,
    @Res() response: Response,
    @Query(RoutesConstants.ID) id: string,
    @Body() updateUserDto: any,
    @UploadedFiles() documents: Express.Multer.File[],
  ): Promise<void> {
    try {
      let result = await this.service.updateById(
        id || (request.user as any).id,
        updateUserDto,
        documents,
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
    @Body() passwordDto: any,
  ): Promise<void> {
    try {
      let result = await this.service.setPassword(
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
    @Body() usernameDto: any,
  ): Promise<void> {
    try {
      let result = await this.service.checkUsername(
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
    @Body() changePasswordDto: any,
  ): Promise<void> {
    try {
      let result = await this.service.changePassword(
        (request.user as any).id,
        changePasswordDto,
      );
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Post("/filter")
  async filter(
    @Req() request: Request,
    @Res() response: Response,
    @Body() filterCriteria: any,
    @Query(RoutesConstants.PAGE) page: number = 1,
    @Query(RoutesConstants.PAGESIZE) pageSize: number = 10,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      const result: any = await this.service.filter(
        filterCriteria,
        [],
        page,
        pageSize,
        filterType,
      );
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Delete(RoutesConstants.PARAM_ID)
  async delete(
    @Req() request: Request,
    @Res() response: Response,
    @Param(RoutesConstants.ID) id: string,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      let result = await this.service.delete(id, filterType);
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }
}
