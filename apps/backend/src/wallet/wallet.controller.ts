import { Controller, Get, Req, UseGuards, Post, Body } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { WalletService } from "./wallet.service";
@Controller("wallet")
export class WalletController {
    constructor(private walletService: WalletService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async me(@Req() req: any) {
        return this.walletService.wallet(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get("ledger")
    async ledger(@Req() req: any) {
        return this.walletService.ledger(req.user.userId);
    }
    @UseGuards(JwtAuthGuard)
    @Post("reward")
    async reward(@Req() req: any, @Body() body: any) {
        return this.walletService.addPoints(
          req.user.userId,
          Number(body.points || 0),
          Number(body.xp || 0),
        );
    }
}