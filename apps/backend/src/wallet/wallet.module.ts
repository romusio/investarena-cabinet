import { Module } from "@nestjs/common";
import { WalletController } from "./wallet.controller";
import { WalletService } from "./wallet.service";
import { PrismaModule } from "../prisma/prisma.module";
import { AchievementsModule } from "../achievements/achievements.module";

@Module({
    imports: [PrismaModule, AchievementsModule],
    controllers: [WalletController],
    providers: [WalletService],
})
export class WalletModule {}