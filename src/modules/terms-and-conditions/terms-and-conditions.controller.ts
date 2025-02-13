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
} from '@nestjs/common';
import { TermsAndConditionsService } from './terms-and-conditions.service';
import { TermsAndConditions } from './entities/terms-and-conditions.entity';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { Request, Response } from 'express';
import { RoutesConstants } from '../../constants/routes.constant';
import {
  errorResponse,
  successPaginatedResponse,
  successResponse,
} from '../../base/response';

@UseGuards(JwtAuthGuard)
@Controller('terms-and-conditions')
export class TermsAndConditionsController {
  constructor(
    private readonly termsAndConditionsService: TermsAndConditionsService,
  ) {}

  @Post()
  async create(
    @Req() request: Request,
    @Res() response: Response,
    @Body() createObject: Partial<TermsAndConditions>,
  ): Promise<void> {
    try {
      let result = await this.termsAndConditionsService.create(
        createObject,
        request.query,
      );
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Get('/filter')
  async getFilter(
    @Req() request: Request,
    @Res() response: Response,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      const result: any = await this.termsAndConditionsService.filter(
        request.query,
        [],
        filterType,
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
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      const [result, count]: any = await this.termsAndConditionsService.getAll(
        page,
        pageSize,
        filterType,
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
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      let result = await this.termsAndConditionsService.getById(id, filterType);
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Put(RoutesConstants.PARAM_ID)
  async update(
    @Req() request: Request,
    @Res() response: Response,
    @Param(RoutesConstants.ID) id: string,
    @Body() updateObject: Partial<TermsAndConditions>,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      let result = await this.termsAndConditionsService.update(
        id,
        updateObject,
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
      let result = await this.termsAndConditionsService.delete(id, filterType);
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Post('/filter')
  async filter(
    @Req() request: Request,
    @Res() response: Response,
    @Body() filterCriteria: any,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      const result: any = await this.termsAndConditionsService.filter(
        filterCriteria,
        [],
        filterType,
      );
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }
}
