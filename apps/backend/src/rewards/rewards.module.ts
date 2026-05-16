import { Module } from "@nestjs/common";
import { RewardsController } from "./rewards.controller";
import { RewardsService } from "./rewards.service";
import { PrismaModule } from "../prisma/prisma.module";
import { AchievementsModule} from '../achievements/achievements.module';

@Module({
    imports: [PrismaModule, AchievementsModule],
    controllers: [RewardsController],
    providers: [RewardsService],
})
export class RewardsModule {}