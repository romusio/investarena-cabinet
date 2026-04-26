import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private users: UsersService, private jwt: JwtService) {}

    async register(email: string, password: string, fullName?: string) {
        const existing = await this.users.findByEmail(email);
        if (existing) throw new ConflictException('Email already registered');

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await this.users.createUser({ email, passwordHash, fullName });

        return this.issueTokens(user.id, user.email);
    }

    async login(email: string, password: string) {
        const user = await this.users.findByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid email or password');

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) throw new UnauthorizedException('Invalid email or password');

        return this.issueTokens(user.id, user.email);
    }

    private issueTokens(userId: string, email: string) {
        const payload = { sub: userId, email };

        const accessToken = this.jwt.sign(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: '15m',
        });

        const refreshToken = this.jwt.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
        });

        return { accessToken, refreshToken };
    }
}
