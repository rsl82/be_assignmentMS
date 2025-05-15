import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { AuthService } from "../services/auth.service";
import { LoginUserDto } from "../dto/login-user.dto";


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return await this.authService.createUser(createUserDto);
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        return await this.authService.login(loginUserDto);
    }
}