import { Body, Controller, Patch, Post } from "@nestjs/common";
import { CreateUserDto, LoginUserDto, ChangeRoleDto } from "common";
import { AuthService } from "../services/auth.service";


@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        const user = await this.authService.createUser(createUserDto);
        return { user };
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        const token = await this.authService.login(loginUserDto);
        return { token };
    }

    @Patch('role')
    async changeRole(@Body() changeRoleDto: ChangeRoleDto) {
        const success = await this.authService.changeRole(changeRoleDto);
        return { success };
    }
}