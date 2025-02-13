import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import * as firebase from 'firebase-admin';
import { NotificationToken } from './entities/notification-token.entity';
import { ConfigModule } from '@nestjs/config';
import admin from 'firebase-admin';
ConfigModule.forRoot();

const { FIREBASE_CREDENTIALS } = process.env;
const serviceAccount = JSON.parse(FIREBASE_CREDENTIALS);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepo: Repository<Notification>,
    @InjectRepository(NotificationToken)
    private readonly notificationTokenRepo: Repository<NotificationToken>,
  ) {}

  acceptPushNotification = async (
    user: any,
    notification_dto: any,
  ): Promise<NotificationToken> => {
    const existingToken = await this.notificationTokenRepo.findOne({
      where: {
        user: { id: user.id },
        device_type: notification_dto.device_type,
      },
    });

    if (existingToken) {
      existingToken.notification_token = notification_dto.notification_token;
      existingToken.status = 'ACTIVE';
      await this.notificationTokenRepo.save(existingToken);
      return existingToken;
    } else {
      const newToken = this.notificationTokenRepo.create({
        user: user,
        device_type: notification_dto.device_type,
        notification_token: notification_dto.notification_token,
        status: 'ACTIVE',
      });
      await this.notificationTokenRepo.save(newToken);
      return newToken;
    }
  };

  disablePushNotification = async (
    user: any,
    update_dto: any,
  ): Promise<void> => {
    try {
      await this.notificationTokenRepo.update(
        { user: { id: user.id }, device_type: update_dto.device_type },
        {
          status: 'INACTIVE',
        },
      );
    } catch (error) {
      return error;
    }
  };

  getNotificationsByUser = async (
    id: string,
    notificationType: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<any> => {
    let [result, count] = await this.notificationsRepo.findAndCount({
      where: { created_by: id, notificationType },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    result = result.map((r: any) => {
      if (r.additionalData) {
        r.additionalData = JSON.parse(r.additionalData);
      }
      const notification: any = {};
      notification[r.notificationType] = {
        createdAt: r.createdAt,
        modifiedAt: r.modifiedAt,
        userAvator: r.additionalData.userAvator,
        title: r.title,
        body: r.body,
        created_by: r.created_by,
        id: r.additionalData?.id,
        text: r.additionalData?.text || '',
        media: r.additionalData?.media || '',
      };
      return { notificationType: r.notificationType, ...notification };
    });

    return { result, count };
  };

  sendPush = async (
    id: string,
    notificationType: string,
    title: string,
    body: string,
    additionalData: any = {},
  ): Promise<void> => {
    const notification = await this.notificationTokenRepo.findOne({
      where: { user: { id }, status: 'ACTIVE' },
    });
    if (notification) {
      await this.notificationsRepo.save({
        notification_token: notification,
        title,
        body,
        notificationType,
        status: 'ACTIVE',
        created_by: id,
        additionalData: additionalData.notificationData,
      });
      await firebase
        .messaging()
        .send({
          notification: { title, body },
          token: notification.notification_token,
          android: { priority: 'high' },
          data: additionalData,
        })
        .catch((error: any) => {
          console.error(error);
        });
    }
  };
}
