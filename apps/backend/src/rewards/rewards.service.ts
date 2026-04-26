import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { LedgerType, RewardType, RedemptionStatus } from "@prisma/client";

@Injectable()
export class RewardsService {
    constructor(private prisma: PrismaService) {}

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

    async redeem(userId: string, dto: { rewardId: string; deliveryName?: string; deliveryPhone?: string; deliveryAddress?: string }) {
        const reward = await this.prisma.rewardItem.findUnique({ where: { id: dto.rewardId } });
        if (!reward || !reward.isActive) throw new NotFoundException("Награда не найдена");

        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException("Пользователь не найден");

        if (user.points < reward.costPoints) throw new BadRequestException("Недостаточно баллов");

        if (reward.type === RewardType.MERCH) {
            if (reward.stock !== null && reward.stock <= 0) throw new BadRequestException("Нет в наличии");
            if (!dto.deliveryAddress) throw new BadRequestException("Для мерча нужен адрес доставки");
        }

        return this.prisma.$transaction(async (tx) => {
            // 1) создаём redemption (заказ)
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

            // 2) списываем points
            await tx.user.update({
                where: { id: userId },
                data: { points: { decrement: reward.costPoints } },
            });

            // 3) журнал
            await tx.pointsLedger.create({
                data: {
                    userId,
                    type: LedgerType.SPEND,
                    amount: reward.costPoints, // amount всегда положительный, знак задаёт type
                    reason: 'Обмен на награду: ${reward.title}',
            redemptionId: redemption.id,
        },
        });

            // 4) stock для MERCH
            if (reward.type === RewardType.MERCH && reward.stock !== null) {
                await tx.rewardItem.update({
                    where: { id: reward.id },
                    data: { stock: { decrement: 1 } },
                });
            }

            const freshUser = await tx.user.findUnique({
                where: { id: userId },
                select: { points: true, xp: true, level: true, email: true, fullName: true, id: true },
            });

            return { redemption, wallet: freshUser };
        });
    }
}