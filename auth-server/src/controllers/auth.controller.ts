import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { AuthService } from "../services/auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return await this.authService.createUser(createUserDto);
    }
}