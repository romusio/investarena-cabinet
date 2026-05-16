import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { AppController } from "./app.controller";
import { GamificationModule } from "./gamification/gamification.module";
import { RewardsModule } from "./rewards/rewards.module";
import { WalletModule } from "./wallet/wallet.module";
import { AchievementsModule} from './achievements/achievements.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    GamificationModule,
    RewardsModule,
    WalletModule,
    AchievementsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}