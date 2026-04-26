import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class WalletService {
    async addPoints(userId: string, points: number, xp: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error("Пользователь не найден");
        }

        const newXp = user.xp + xp;
        const newLevel = Math.floor(newXp / 100) + 1;

        await this.prisma.user.update({
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
                reason: "Награда за задание",
            },
        });

        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                xp: true,
                level: true,
                points: true,
                createdAt: true,
            },
        });
    }

    constructor(private prisma: PrismaService) {}

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
}