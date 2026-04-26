import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class GamificationService {
    constructor(private prisma: PrismaService) {}

    async earnXp(userId: string, xpAmount = 10, pointsAmount = 5) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException("Пользователь не найден");
        }

        const newXp = user.xp + xpAmount;
        const newLevel = Math.floor(newXp / 100) + 1;

        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                xp: newXp,
                level: newLevel,
                points: {
                    increment: pointsAmount,
                },
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                xp: true,
                level: true,
                points: true,
            },
        });

        return {
            message: `Начислено +${xpAmount} XP и +${pointsAmount} points`,
          user: updatedUser,
    };
    }
}