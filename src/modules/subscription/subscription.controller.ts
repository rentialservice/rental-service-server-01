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
} from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { Subscription } from "./entities/subscription.entity";
import { JwtAuthGuard } from "../auth/jwt.auth.guard";
import { Request, Response } from "express";
import { RoutesConstants } from "../../constants/routes.constant";
import {
  errorResponse,
  successPaginatedResponse,
  successResponse,
} from "../../base/response";
import { AllowWithoutSubscription } from "../auth/allow-without-subscription.decorator";

@UseGuards(JwtAuthGuard)
@Controller("subscription")
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @AllowWithoutSubscription()
  async create(
    @Req() request: Request,
    @Res() response: Response,
    @Body() createObject: Partial<Subscription>,
  ): Promise<void> {
    try {
      let result = await this.subscriptionService.create(createObject);
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Get("/filter")
  @AllowWithoutSubscription()
  async getFilter(
    @Req() request: Request,
    @Res() response: Response,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      const result: any = await this.subscriptionService.filter(
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
  @AllowWithoutSubscription()
  async getAll(
    @Req() request: Request,
    @Res() response: Response,
    @Query(RoutesConstants.PAGE) page: number = 1,
    @Query(RoutesConstants.PAGESIZE) pageSize: number = 10,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      const [result, count]: any = await this.subscriptionService.getAll(
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
  @AllowWithoutSubscription()
  async getById(
    @Req() request: Request,
    @Res() response: Response,
    @Param(RoutesConstants.ID) id: string,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      let result = await this.subscriptionService.getById(id, filterType);
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Put(RoutesConstants.PARAM_ID)
  @AllowWithoutSubscription()
  async update(
    @Req() request: Request,
    @Res() response: Response,
    @Param(RoutesConstants.ID) id: string,
    @Body() updateObject: Partial<Subscription>,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      let result = await this.subscriptionService.update(
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
  @AllowWithoutSubscription()
  async delete(
    @Req() request: Request,
    @Res() response: Response,
    @Param(RoutesConstants.ID) id: string,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      let result = await this.subscriptionService.delete(id, filterType);
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }

  @Post("/filter")
  @AllowWithoutSubscription()
  async filter(
    @Req() request: Request,
    @Res() response: Response,
    @Body() filterCriteria: any,
    @Query(RoutesConstants.FILTERTYPE) filterType: string,
  ): Promise<void> {
    try {
      const result: any = await this.subscriptionService.filter(
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
