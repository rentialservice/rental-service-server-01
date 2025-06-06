import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
  Res,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from "@nestjs/common";
import { FirmService } from "./firm.service";
import { Firm } from "./entities/firm.entity";
import { JwtAuthGuard } from "../auth/jwt.auth.guard";
import { Request, Response } from "express";
import { RoutesConstants } from "../../constants/routes.constant";
import {
  errorResponse,
  successPaginatedResponse,
  successResponse,
} from "../../base/response";
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from "@nestjs/platform-express";

@UseGuards(JwtAuthGuard)
@Controller("firm")
export class FirmController {
  constructor(private readonly firmService: FirmService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "media", maxCount: 1 },
      { name: "signature", maxCount: 1 },
    ])
  )
  async create(
    @Req() request: Request,
    @Res() response: Response,
    @Body() createObject: Partial<Firm>,
    @UploadedFiles()
    files: {
      media?: Express.Multer.File[];
      signature?: Express.Multer.File[];
    }
  ): Promise<void> {
    try {
      const media = files?.media?.[0];
      const signature = files?.signature?.[0];

      const result = await this.firmService.create(
        createObject,
        media,
        signature
      );
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Get()
  async getAll(
    @Req() request: Request,
    @Res() response: Response,
    @Query(RoutesConstants.PAGE) page: number = 1,
    @Query(RoutesConstants.PAGESIZE) pageSize: number = 10,
    @Query(RoutesConstants.FILTERTYPE) filterType: string
  ): Promise<void> {
    try {
      const [result, count]: any = await this.firmService.getAll(
        page,
        pageSize,
        filterType
      );
      successPaginatedResponse(response, result, count, page, pageSize);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Get(RoutesConstants.PARAM_ID)
  async getById(
    @Req() request: Request,
    @Res() response: Response,
    @Param(RoutesConstants.ID) id: string,
    @Query(RoutesConstants.FILTERTYPE) filterType: string
  ): Promise<void> {
    try {
      let result = await this.firmService.getById(id, filterType);
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Put(RoutesConstants.PARAM_ID)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "media", maxCount: 1 },
      { name: "signature", maxCount: 1 },
    ])
  )
  async update(
    @Req() request: Request,
    @Res() response: Response,
    @Param(RoutesConstants.ID) id: string,
    @Body() updateObject: Partial<Firm>,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
    @UploadedFiles()
    files: {
      media?: Express.Multer.File[];
      signature?: Express.Multer.File[];
    }
  ): Promise<void> {
    try {
      const media = files?.media?.[0];
      const signature = files?.signature?.[0];

      const result = await this.firmService.update(
        id,
        updateObject,
        filterType,
        media,
        signature
      );
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Put("/update-subscription/:id")
  async updateSubscription(
    @Req() request: Request,
    @Res() response: Response,
    @Param(RoutesConstants.ID) id: string,
    @Body() updateObject: Partial<Firm>,
    @Query(RoutesConstants.FILTERTYPE) filterType: string
  ): Promise<void> {
    try {
      let result = await this.firmService.updateSubscription(
        id,
        updateObject,
        filterType
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
    @Query(RoutesConstants.FILTERTYPE) filterType: string
  ): Promise<void> {
    try {
      let result = await this.firmService.delete(id, filterType);
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
    @Query(RoutesConstants.FILTERTYPE) filterType: string
  ): Promise<void> {
    try {
      const result: any = await this.firmService.filter(
        filterCriteria,
        [],
        filterType
      );
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }
}
