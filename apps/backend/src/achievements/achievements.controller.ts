import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AchievementsService } from "./achievements.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("achievements")
export class AchievementsController {
  constructor(private readonly achievements: AchievementsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Req() req: any) {
    return this.achievements.listForUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("unlock")
  async unlock(@Req() req: any, @Body() body: { key: string }) {
    return this.achievements.unlock(req.user.userId, body.key);
  }
}