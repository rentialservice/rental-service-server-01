import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  Req,
  Put,
  Query,
} from "@nestjs/common";
import { SubscriptionService } from "../services/subscription.service";
import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../../base/response";
import { RoutesConstants } from "../../../constants/routes.constant";
import { AllowWithoutSubscription } from "../../auth/allow-without-subscription.decorator";
import { Subscription } from "../entities/subscription.entity";

@Controller("subscription")
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @AllowWithoutSubscription()
  async createSubscription(
    @Req() request: Request,
    @Res() response: Response,
    @Body() data: any
  ) {
    try {
      const result = await this.subscriptionService.createSubscription(data);
      successResponse(response, result);
    } catch (error) {
      errorResponse(response, error);
    }
  }

  @Post(":subscriptionId/firm/:firmId")
  @AllowWithoutSubscription()
  async assignSubscriptionToFirm(
    @Req() request: Request,
    @Res() response: Response,
    @Param("subscriptionId") subscriptionId: string,
    @Param("firmId") firmId: string,
    @Body() data: any
  ) {
    try {
      const result = await this.subscriptionService.assignSubscriptionToFirm(
        subscriptionId,
        firmId,
        data
      );
      successResponse(response, result);
    } catch (error) {
      errorResponse(response, error);
    }
  }

  @Get("firm/:firmId")
  @AllowWithoutSubscription()
  async getSubscriptionsByFirm(
    @Req() request: Request,
    @Res() response: Response,
    @Param("firmId") firmId: string
  ) {
    try {
      const result =
        await this.subscriptionService.getSubscriptionsByFirm(firmId);
      successResponse(response, result);
    } catch (error) {
      errorResponse(response, error);
    }
  }

  @Get("details/users")
  @AllowWithoutSubscription()
  async getAllSubscriptions(
    @Req() request: Request,
    @Res() response: Response
  ) {
    try {
      const result = await this.subscriptionService.getAllSubscriptions();
      successResponse(response, result);
    } catch (error) {
      errorResponse(response, error);
    }
  }

  @Post("details")
  @AllowWithoutSubscription()
  async createSubscriptionDetails(
    @Req() request: Request,
    @Res() response: Response,
    @Body() data: any
  ) {
    try {
      const result =
        await this.subscriptionService.createSubscriptionDetails(data);
      successResponse(response, result);
    } catch (error) {
      errorResponse(response, error);
    }
  }

  @Put("details/:id")
  @AllowWithoutSubscription()
  async updateSubscriptionDetails(
    @Req() request: Request,
    @Res() response: Response,
    @Param("id") id: string,
    @Body() data: any
  ) {
    try {
      const result = await this.subscriptionService.updateSubscriptionDetails(
        id,
        data
      );
      successResponse(response, result);
    } catch (error) {
      errorResponse(response, error);
    }
  }

  @Get("details/:id")
  @AllowWithoutSubscription()
  async getSubscriptionDetails(
    @Req() request: Request,
    @Res() response: Response,
    @Param("id") id: string
  ) {
    try {
      const result = await this.subscriptionService.getSubscriptionDetails(id);
      successResponse(response, result);
    } catch (error) {
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
    @Query(RoutesConstants.FILTERTYPE) filterType: string
  ): Promise<void> {
    try {
      let result = await this.subscriptionService.update(
        id,
        updateObject,
        filterType
      );
      successResponse(response, result);
    } catch (error: any) {
      errorResponse(response, error);
    }
  }
}
