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
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../auth/jwt.auth.guard';
import { RoutesConstants } from '../../../constants/routes.constant';
import {
    errorResponse,
    successPaginatedResponse,
    successResponse,
} from '../../../base/response';
import { NotificationService } from './notification.service';

@Controller("notification")
export class UserController {
    constructor(private readonly notificationService: NotificationService) { }

    @Put('push/enable')
    @UseGuards(JwtAuthGuard)
    async enablePush(
        @Body() update_dto: any,
        @Req() request: Request,
        @Res() response: Response,
    ) {
        try {
            let result = await this.notificationService.acceptPushNotification(
                (request.user as any).id,
                update_dto,
            );
            successResponse(response, result);
        } catch (error: any) {
            errorResponse(response, error);
        }
    }

    @Put('push/disable')
    @UseGuards(JwtAuthGuard)
    async disablePush(
        @Body() update_dto: any,
        @Req() request: Request,
        @Res() response: Response,
    ) {
        try {
            let result = await this.notificationService.disablePushNotification(
                (request.user as any).id,
                update_dto,
            );
            successResponse(response, result);
        } catch (error: any) {
            errorResponse(response, error);
        }
    }

    @Get('push/notifications')
    @UseGuards(JwtAuthGuard)
    async fetchPushNotifications(
        @Req() request: Request,
        @Res() response: Response,
        @Query('notificationType') notificationType: string,
        @Query(RoutesConstants.PAGE) page: number = 1,
        @Query(RoutesConstants.PAGESIZE) pageSize: number = 10,
    ) {
        try {
            let { result, count } = await this.notificationService.getNotificationsByUser(
                (request.user as any).id,
                notificationType,
                page,
                pageSize,
            );

            successPaginatedResponse(response, result, count, page, pageSize);
        } catch (error: any) {
            console.log(error);
            errorResponse(response, error);
        }
    }
}
