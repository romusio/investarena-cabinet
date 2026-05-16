import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { LedgerType, RedemptionStatus, RewardType } from "@prisma/client";
import { AchievementsService } from "../achievements/achievements.service";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class RewardsService {
    constructor(
      private prisma: PrismaService,
      private achievementsService: AchievementsService,
    ) {}

    async listActive() {
        return this.prisma.rewardItem.findMany({
            where: { isActive: true },
            orderBy: { costPoints: "asc" },
        });
    }

    async myRedemptions(userId: string) {
        return this.prisma.rewardRedemption.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }

    async redeem(
      userId: string,
      dto: {
          rewardId: string;
          deliveryName?: string;
          deliveryPhone?: string;
          deliveryAddress?: string;
      },
    ) {
        const reward = await this.prisma.rewardItem.findUnique({
            where: { id: dto.rewardId },
        });

        if (!reward || !reward.isActive) {
            throw new NotFoundException("Награда не найдена");
        }

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException("Пользователь не найден");
        }

        if (user.points < reward.costPoints) {
            throw new BadRequestException("Недостаточно баллов");
        }

        if (reward.type === RewardType.MERCH) {
            if (reward.stock !== null && reward.stock <= 0) {
                throw new BadRequestException("Нет в наличии");
            }
        }

        const result = await this.prisma.$transaction(async (tx) => {
            const redemption = await tx.rewardRedemption.create({
                data: {
                    userId,
                    itemId: reward.id,
                    status: RedemptionStatus.PENDING,

                    itemTitle: reward.title,
                    itemType: reward.type,
                    costPoints: reward.costPoints,
                    value: reward.value ?? null,

                    deliveryName: dto.deliveryName ?? null,
                    deliveryPhone: dto.deliveryPhone ?? null,
                    deliveryAddress: dto.deliveryAddress ?? null,
                },
            });

            await tx.user.update({
                where: { id: userId },
                data: {
                    points: {
                        decrement: reward.costPoints,
                    },
                },
            });

            await tx.pointsLedger.create({
                data: {
                    userId,
                    type: LedgerType.SPEND,
                    amount: reward.costPoints,
                    reason: `Обмен на награду: ${reward.title}`,
            redemptionId: redemption.id,
        },
        });

            if (reward.type === RewardType.MERCH && reward.stock !== null) {
                await tx.rewardItem.update({
                    where: { id: reward.id },
                    data: {
                        stock: {
                            decrement: 1,
                        },
                    },
                });
            }

            await this.achievementsService.unlock(userId, "first_purchase");

            if (reward.type === RewardType.GAME_HOURS) {
                await this.achievementsService.unlock(userId, "game_hours");
            }
            const freshUser = await tx.user.findUnique({
                where: { id: userId },
                select: {
                    points: true,
                    xp: true,
                    level: true,
                    email: true,
                    fullName: true,
                    id: true,
                },
            });

            return {
                redemption,
                wallet: freshUser,
            };
        });

        await this.achievementsService.unlockByKey(userId, "first_purchase");

        if (reward.type === RewardType.GAME_HOURS) {
            await this.achievementsService.unlockByKey(userId, "game_hours");
        }

        await this.achievementsService.checkProgressAchievements(userId);

        return result;
    }
}