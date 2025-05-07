// auth.module.ts
import { Global, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtStrategy } from "./jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailModule } from "../supporting-modules/mail/mail.module";
import { Blacklist } from "./entities/blacklist.entity";
import { Seller } from "../users/seller/entities/seller.entity";
import { Buyer } from "../users/buyer/entities/buyer.entity";
import { Admin } from "../users/admin/entities/admin.entity";
import { FirmModule } from "../firm/firm.module";

@Global()
@Module({
  imports: [
    ConfigModule, // ensure this is here so ConfigService works in factory
    TypeOrmModule.forFeature([Blacklist, Seller, Admin, Buyer]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "1d" },
      }),
    }),
    MailModule,
    FirmModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule], // 👈 export JwtModule
})
export class AuthModule {}
