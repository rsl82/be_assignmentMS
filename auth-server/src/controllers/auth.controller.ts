import { Body, Controller, Patch, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { ChangeRoleDto } from '../dto/change-role.dto';

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
