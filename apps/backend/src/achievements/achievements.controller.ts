import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AchievementsService } from "./achievements.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Achievements")
@Controller("achievements")
export class AchievementsController {
  constructor(private readonly achievements: AchievementsService) {}

  @ApiOperation({ summary: "Получить достижения пользователя" })
  @ApiResponse({
    status: 200,
    description: "Список достижений",
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Req() req: any) {
    return this.achievements.listForUser(req.user.userId);
  }

  @ApiOperation({ summary: "Открыть достижение вручную" })
  @ApiBody({
    schema: {
      example: {
        key: "first_login",
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Достижение открыто",
  })
  @UseGuards(JwtAuthGuard)
  @Post("unlock")
  async unlock(@Req() req: any, @Body() body: { key: string }) {
    return this.achievements.unlock(req.user.userId, body.key);
  }
}