import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { RewardsService } from "./rewards.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RedeemDto } from "./dto/redeem.dto";

@Controller("rewards")
export class RewardsController {
    constructor(private rewards: RewardsService) {}

    @Get()
    async list() {
        return this.rewards.listActive();
    }

    @UseGuards(JwtAuthGuard)
    @Get("my")
    async my(@Req() req: any) {
        return this.rewards.myRedemptions(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post("redeem")
    async redeem(@Req() req: any, @Body() dto: RedeemDto) {
        return this.rewards.redeem(req.user.userId, dto);
    }
}