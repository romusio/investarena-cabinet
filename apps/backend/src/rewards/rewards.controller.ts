import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { RewardsService } from "./rewards.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RedeemDto } from "./dto/redeem.dto";
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";

@ApiTags("Rewards")
@ApiBearerAuth()
@Controller("rewards")
export class RewardsController {
    constructor(private rewards: RewardsService) {}

    @ApiOperation({ summary: "Получить список доступных наград" })
    @ApiResponse({
        status: 200,
        description: "Список активных наград магазина",
    })
    @Get()
    async list() {
        return this.rewards.listActive();
    }

    @ApiOperation({ summary: "Получить историю обменов пользователя" })
    @ApiResponse({
        status: 200,
        description: "Список покупок и обменов текущего пользователя",
    })
    @UseGuards(JwtAuthGuard)
    @Get("my")
    async my(@Req() req: any) {
        return this.rewards.myRedemptions(req.user.userId);
    }

    @ApiOperation({ summary: "Обменять StrikeCoin на награду" })
    @ApiBody({
        schema: {
            example: {
                rewardId: "reward-id",
                deliveryName: "Иван Иванов",
                deliveryPhone: "+79990000000",
                deliveryAddress: "г. Москва, ул. Примерная, д. 1",
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: "Награда успешно оформлена",
    })
    @ApiResponse({
        status: 400,
        description: "Недостаточно баллов или товара нет в наличии",
    })
    @ApiResponse({
        status: 404,
        description: "Награда или пользователь не найден",
    })
    @UseGuards(JwtAuthGuard)
    @Post("redeem")
    async redeem(@Req() req: any, @Body() dto: RedeemDto) {
        return this.rewards.redeem(req.user.userId, dto);
    }
}