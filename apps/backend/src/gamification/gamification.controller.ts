import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GamificationService } from './gamification.service';

@Controller('gamification')
export class GamificationController {
    constructor(private gamification: GamificationService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post('earn')
    earn(@Req() req: any) {
        return this.gamification.earnXp(req.user.userId, 10);
    }
}
