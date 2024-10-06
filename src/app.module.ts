import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { typeOrmAsyncConfig } from './config/typeorm-config';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './modules/supporting-modules/mail/mail.module';
import { NotificationModule } from './modules/supporting-modules/notification/notification.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirmModule } from './modules/firm/firm.module';
import { DynamicModule } from './modules/dynamic/dynamic.module';
import { BuyerModule } from './modules/users/buyer/buyer.module';
import { SellerModule } from './modules/users/seller/seller.module';
import { AdminModule } from './modules/users/admin/admin.module';
import { S3Module } from './modules/supporting-modules/s3/s3.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    AdminModule,
    BuyerModule,
    SellerModule,
    S3Module,
    UserModule,
    AuthModule,
    MailModule,
    NotificationModule,
    FirmModule,
    DynamicModule,
    CategoryModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
