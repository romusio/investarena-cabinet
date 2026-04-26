import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    createUser(data: { email: string; passwordHash: string; fullName?: string }) {
        return this.prisma.user.create({
            data: {
                email: data.email,
                passwordHash: data.passwordHash,
                fullName: data.fullName ?? null,
            },
        });
    }
    findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            select: { id: true, email: true, fullName: true, xp: true, level: true, createdAt: true },
        });
    }

    async updateUser(userId: string, data: { fullName?: string }) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                fullName: data.fullName ?? undefined,
            },
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

}
