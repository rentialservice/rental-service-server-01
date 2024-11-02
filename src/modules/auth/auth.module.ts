import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../supporting-modules/mail/mail.module';
import { Blacklist } from './entities/blacklist.entity';
import { Seller } from '../users/seller/entities/seller.entity';
import { Buyer } from '../users/buyer/entities/buyer.entity';
import { Admin } from '../users/admin/entities/admin.entity';
import { FirmModule } from '../firm/firm.module';

@Module({
  imports: [TypeOrmModule.forFeature([Blacklist, Seller, Admin, Buyer]), JwtModule, MailModule, FirmModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }
