import { Controller, Get, Req, UseGuards, Body, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private users: UsersService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async me(@Req() req: any) {
        const userId = req.user.userId;
        return this.users.findById(userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('me')
    async update(@Req() req: any, @Body() body: any) {
        const userId = req.user.userId;
        return this.users.updateUser(userId, body);
    }
}
