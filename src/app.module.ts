import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmAsyncConfig } from "./config/typeorm-config";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { modules } from "./list/modules/modules";
import { Subscription } from "./modules/subscription/entities/subscription.entity";
import { SubscriptionService } from "./modules/subscription/subscription.service";
import { APP_GUARD } from "@nestjs/core";
import { SubscriptionGuard } from "./modules/auth/subscription.guard";
import { JwtAuthGuard } from "./modules/auth/jwt.auth.guard";

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([Subscription]),
    ...modules,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SubscriptionService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Runs first, sets req.user
    },
    {
      provide: APP_GUARD,
      useClass: SubscriptionGuard, // Runs second, checks subscription
    },
  ],
})
export class AppModule {}
