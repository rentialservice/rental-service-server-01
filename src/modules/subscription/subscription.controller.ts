import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req, Res, Query } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './entities/subscription.entity';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { Request, Response } from 'express';
import { RoutesConstants } from '../../constants/routes.constant';
import { errorResponse, successPaginatedResponse, successResponse } from '../../base/response';

@UseGuards(JwtAuthGuard)
@Controller('firm')
export class SubscriptionController {
    constructor(private readonly firmService: SubscriptionService) { }

    @Post()
    async create(
        @Req() request: Request,
        @Res() response: Response,
        @Body() createObject: Partial<Subscription>): Promise<void> {
        try {
            let result = await this.firmService.create(createObject);
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
            const [result, count]: any = await this.firmService.getAll(page, pageSize, filterType);
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
        @Body() updateObject: Partial<Subscription>,
        @Query(RoutesConstants.FILTERTYPE) filterType: string,
    ): Promise<void> {
        try {
            let result = await this.firmService.update(id, updateObject, filterType);
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
