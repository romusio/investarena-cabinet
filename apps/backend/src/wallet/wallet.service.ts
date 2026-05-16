import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AchievementsService} from '../achievements/achievements.service';

@Injectable()
export class WalletService {
    async addPoints(userId: string, points: number, xp: number, taskKey?: string) {
        if (taskKey) {
            const existingClaim = await this.prisma.userTaskClaim.findUnique({
                where: {
                    userId_taskKey: {
                        userId,
                        taskKey,
                    },
                },
            });

            if (existingClaim) {
                throw new Error("Награда за это задание уже получена");
            }
        }

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error("Пользователь не найден");
        }

        const newXp = user.xp + xp;
        const newLevel = Math.floor(newXp / 100) + 1;

        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                xp: newXp,
                level: newLevel,
                points: user.points + points,
            },
        });

        await this.prisma.pointsLedger.create({
            data: {
                userId,
                amount: points,
                type: "EARN",
                reason: taskKey ? `Награда за задание: ${taskKey}` : "Награда за задание",
    },
    });

        if (taskKey) {
            await this.prisma.userTaskClaim.create({
                data: {
                    userId,
                    taskKey,
                },
            });
        }

        await this.achievementsService.checkProgressAchievements(userId);

        if (taskKey) {
            await this.achievementsService.unlockByKey(userId, "first_task");
        }

        const taskCount = await this.prisma.userTaskClaim.count({
            where: { userId },
        });

        if (taskCount >= 3) {
            await this.achievementsService.unlockByKey(userId, "three_tasks_day");
        }

        if (newLevel >= 3) {
            await this.achievementsService.unlockByKey(userId, "level_3");
        }

        if (newXp >= 100) {
            await this.achievementsService.unlockByKey(userId, "xp_100");
        }

        if (updatedUser.points >= 250) {
            await this.achievementsService.unlockByKey(userId, "points_250");
        }

        return updatedUser;
    }
    constructor(
      private prisma: PrismaService,
      private achievementsService: AchievementsService,
    ) {}
    async wallet(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, fullName: true, xp: true, level: true, points: true, createdAt: true },
        });
    }

    async ledger(userId: string) {
        return this.prisma.pointsLedger.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 50,
            include: {
                redemption: {
                    select: {
                        id: true,
                        itemTitle: true,
                        itemType: true,
                        costPoints: true,
                        createdAt: true,
                    },
                },
            },
        });
    }
    async taskClaims(userId: string) {
        const claims = await this.prisma.userTaskClaim.findMany({
            where: { userId },
            select: {
                taskKey: true,
                claimedAt: true,
            },
            orderBy: {
                claimedAt: "desc",
            },
        });

        return claims;
    }
}