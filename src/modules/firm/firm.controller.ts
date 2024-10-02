import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req, Res, Query } from '@nestjs/common';
import { FirmService } from './firm.service';
import { Firm } from './entities/firm.entity';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { Request, Response } from 'express';
import { RoutesConstants } from '../../constants/routes.constant';
import { errorResponse, successPaginatedResponse, successResponse } from '../../base/response';

@UseGuards(JwtAuthGuard)
@Controller('firm')
export class FirmController {
    constructor(private readonly firmService: FirmService) { }

    @Post()
    async create(
        @Req() request: Request,
        @Res() response: Response,
        @Body() firmData: Partial<Firm>): Promise<void> {
        try {
            let result = await this.firmService.create(firmData);
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
            let { result, count } = await this.firmService.getAll(page, pageSize, filterType);
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
            let result = await this.firmService.getById(id, filterType);
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
        @Body() updateData: Partial<Firm>,
        @Query(RoutesConstants.FILTERTYPE) filterType: string,
    ): Promise<void> {
        try {
            let result = await this.firmService.update(id, updateData, filterType);
            successResponse(response, result);
        } catch (error: any) {
            errorResponse(response, error);
        }
    }

    @Put(RoutesConstants.ACTION)
    async updateActionById(
        @Req() request: Request,
        @Res() response: Response,
        @Query(RoutesConstants.ID) id: string,
        @Query(RoutesConstants.ACTION) action: string,
        @Query(RoutesConstants.FILTERTYPE) filterType: string,
    ): Promise<void> {
        try {
            let result = await this.firmService.updateActionById(id, action, filterType);
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
            let result = await this.firmService.delete(id, filterType);
            successResponse(response, result);
        } catch (error: any) {
            errorResponse(response, error);
        }
    }
}
