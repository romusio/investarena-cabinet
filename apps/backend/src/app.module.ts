import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { GamificationModule } from './gamification/gamification.module';
import { RewardsModule } from "./rewards/rewards.module";
import { WalletModule } from "./wallet/wallet.module";

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, GamificationModule, RewardsModule, WalletModule],
  controllers: [AppController],
})
export class AppModule {}
