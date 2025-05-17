import { Get, Post } from "@nestjs/common";
import { UseGuards } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Role } from "common";
import { Roles } from "src/decorators/roles.decorator";
import { RolesGuard } from "src/guards/roles.guard";
import { GatewayService } from "src/services/gateway.service";



@Controller()
export class GatewayController {
    constructor(private readonly gatewayService: GatewayService) {}
    
    //테스트용
    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.USER)
    async getHello(): Promise<string> {
        return 'Hello World!';
    }

    @Post('auth/register')
    

}  