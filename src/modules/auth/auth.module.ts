import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../supporting-modules/mail/mail.module';
import { Blacklist } from './entities/blacklist.entity';
import { Seller } from '../users/seller/entities/seller.entity';
import { Buyer } from '../users/buyer/entities/buyer.entity';
import { Admin } from '../users/admin/entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Blacklist, Seller, Admin, Buyer]), JwtModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }
