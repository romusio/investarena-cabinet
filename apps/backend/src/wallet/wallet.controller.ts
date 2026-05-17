import { Controller, Get, Req, UseGuards, Post, Body } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { WalletService } from "./wallet.service";
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";

@ApiTags("Wallet")
@ApiBearerAuth()
@Controller("wallet")
export class WalletController {
    constructor(private walletService: WalletService) {}

    @ApiOperation({ summary: "Получить кошелек пользователя" })
    @ApiResponse({
        status: 200,
        description: "Данные кошелька",
    })
    @UseGuards(JwtAuthGuard)
    @Get()
    async me(@Req() req: any) {
        return this.walletService.wallet(req.user.userId);
    }

    @ApiOperation({ summary: "История операций" })
    @ApiResponse({
        status: 200,
        description: "Список транзакций",
    })
    @UseGuards(JwtAuthGuard)
    @Get("ledger")
    async ledger(@Req() req: any) {
        return this.walletService.ledger(req.user.userId);
    }

    @ApiOperation({ summary: "Начислить награду" })
    @ApiBody({
        schema: {
            example: {
                points: 50,
                xp: 25,
                taskKey: "daily_login",
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: "Награда начислена",
    })
    @UseGuards(JwtAuthGuard)
    @Post("reward")
    async reward(@Req() req: any, @Body() body: any) {
        return this.walletService.addPoints(
          req.user.userId,
          Number(body.points || 0),
          Number(body.xp || 0),
          body.taskKey,
        );
    }

    @ApiOperation({ summary: "Получить выполненные задания" })
    @ApiResponse({
        status: 200,
        description: "Список выполненных заданий",
    })
    @UseGuards(JwtAuthGuard)
    @Get("task-claims")
    async taskClaims(@Req() req: any) {
        return this.walletService.taskClaims(req.user.userId);
    }
}