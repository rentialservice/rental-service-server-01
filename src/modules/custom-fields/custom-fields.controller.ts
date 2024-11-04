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
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { Request, Response } from 'express';
import { RoutesConstants } from '../../constants/routes.constant';
import {
  errorResponse,
  successPaginatedResponse,
  successResponse,
} from '../../base/response';
import { CustomFieldsService } from './custom-fields.service';
import { CustomFields } from './entities/custom-fields.entity';

@UseGuards(JwtAuthGuard)
@Controller('custom-fields')
export class CustomFieldsController {
  constructor(private readonly customFieldsService: CustomFieldsService) { }

  @Post()
  async create(
    @Req() request: Request,
    @Res() response: Response,
    @Body() createObject: Partial<CustomFields>,
  ): Promise<void> {
    try {
      let result = await this.customFieldsService.create(createObject);
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
      const [result, count]: any = await this.customFieldsService.getAll(
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
      let result = await this.customFieldsService.getById(id, filterType);
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
    @Body() updateObject: Partial<CustomFields>,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      let result = await this.customFieldsService.update(id, updateObject, filterType);
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
      let result = await this.customFieldsService.delete(id, filterType);
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }
}
