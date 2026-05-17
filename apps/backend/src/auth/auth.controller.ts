import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
    ApiBody,
    ApiTags,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) {}

    @ApiOperation({ summary: "Регистрация пользователя" })
    @ApiBody({
        schema: {
            example: {
                email: "user@mail.ru",
                password: "123456",
                fullName: "Иван Иванов",
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: "Пользователь успешно зарегистрирован",
    })
    @Post("register")
    register(@Body() dto: {
        email: string;
        password: string;
        fullName?: string;
    }) {
        return this.auth.register(dto.email, dto.password, dto.fullName);
    }

    @ApiOperation({ summary: "Авторизация пользователя" })
    @ApiBody({
        schema: {
            example: {
                email: "user@mail.ru",
                password: "123456",
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: "Успешный вход",
    })
    @Post("login")
    login(@Body() dto: {
        email: string;
        password: string;
    }) {
        return this.auth.login(dto.email, dto.password);
    }
}
