import { All, Body, Get, Req, Param, ForbiddenException } from "@nestjs/common";
import { UseGuards } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Role } from "common";
import { Roles } from "src/decorators/roles.decorator";
import { RolesGuard } from "src/guards/roles.guard";
import { GatewayService } from "src/services/gateway.service";
import { Request } from 'express';
import { JwtPayload } from "src/interfaces/jwt-payload.interface";
import { User } from "src/decorators/user.decorator";
import { ADMIN_ROUTES, PUBLIC_ROUTES, OPERATOR_ROUTES, RouteConfig } from "src/constants/routes.constant";

@Controller()
export class GatewayController {
    constructor(private readonly gatewayService: GatewayService) {}
    
    //테스트용

    @Get('test/all')
    @UseGuards(AuthGuard('jwt'))
    async getHelloAll(@User() user: JwtPayload): Promise<string> {
        return `Hello All! User: ${JSON.stringify(user)}`;
    }

    @Get('test/user')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.USER)
    async getHello(@User() user: JwtPayload): Promise<string> {
        return `Hello World! User: ${JSON.stringify(user)}`;
    }

    @Get('test/admin')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    async getHelloAdmin(): Promise<string> {
        return 'Hello Admin!';
    }

    private isAllowedRoute(
      routes: Record<string, RouteConfig[]>,
      serverName: string,
      api: string,
      method: string
    ): boolean {
      return routes[serverName]?.some(route =>
        route.path === api && route.methods.includes(method as any)
      ) ?? false;
    }

    // PUBLIC 라우트 처리
    @All('public/:server/:api')
    async publicEndpoints(
      @Param('server') server: string,
      @Param('api') api: string,
      @Req() req: Request,
      @Body() body: any,
    ) {
      const serverName = server.toUpperCase();
      const path = `/${api}`;

      if (!this.isAllowedRoute(PUBLIC_ROUTES, serverName, path, req.method)) {
        throw new ForbiddenException('접근할 수 없는 경로입니다');
      }

      return this.gatewayService.forwardToService(serverName, path, req, undefined, body);
    }

    @All('public/:server/:api/*query')
    async publicEndpointsWithQuery(
      @Param('server') server: string,
      @Param('api') api: string,
      @Param('query') query: string[],
      @Req() req: Request,
      @Body() body: any,
    ) {
      const serverName = server.toUpperCase();
      const apiPath = `/${api}`;
      const fullPath = `/${api}/${query.join('/')}`;

      if (!this.isAllowedRoute(PUBLIC_ROUTES, serverName, apiPath, req.method)) {
        throw new ForbiddenException('접근할 수 없는 경로입니다');
      }

      return this.gatewayService.forwardToService(serverName, fullPath, req, undefined, body);
    }

    // OPERATOR 라우트 처리
    @All('operator/:server/:api')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.OPERATOR, Role.ADMIN)
    async operatorEndpoints(
      @Param('server') server: string,
      @Param('api') api: string,
      @Req() req: Request,
      @User() user: JwtPayload,
      @Body() body: any,
    ) {
      const serverName = server.toUpperCase();
      const path = `/${api}`;

      if (!this.isAllowedRoute(OPERATOR_ROUTES, serverName, path, req.method)) {
        throw new ForbiddenException('접근할 수 없는 경로입니다');
      }

      return this.gatewayService.forwardToService(serverName, path, req, user, body);
    }

    @All('operator/:server/:api/*query')
    async operatorEndpointsWithQuery(
      @Param('server') server: string,
      @Param('api') api: string,
      @Param('query') query: string[],
      @Req() req: Request,
      @User() user: JwtPayload,
      @Body() body: any,
    ) {
      const serverName = server.toUpperCase();
      const apiPath = `/${api}`;
      const fullPath = `/${api}/${query.join('/')}`;

      if (!this.isAllowedRoute(OPERATOR_ROUTES, serverName, apiPath, req.method)) {
        throw new ForbiddenException('접근할 수 없는 경로입니다');
      }

      return this.gatewayService.forwardToService(serverName, fullPath, req, user, body);
    }

    // ADMIN 라우트 처리
    @All('admin/:server/:api')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    async adminEndpoints(
      @Param('server') server: string,
      @Param('api') api: string,
      @Req() req: Request,
      @User() user: JwtPayload,
      @Body() body: any,
    ) {
      const serverName = server.toUpperCase();
      const path = `/${api}`;
      
      if (!this.isAllowedRoute(ADMIN_ROUTES, serverName, path, req.method)) {
        throw new ForbiddenException('접근할 수 없는 경로입니다');
      }

      return this.gatewayService.forwardToService(serverName, path, req, user, body);
    }

    @All('admin/:server/:api/*query')
    async adminEndpointsWithQuery(
      @Param('server') server: string,
      @Param('api') api: string,
      @Param('query') query: string[],
      @Req() req: Request,
      @User() user: JwtPayload,
      @Body() body: any,
    ) {
      const serverName = server.toUpperCase();
      const apiPath = `/${api}`;
      const fullPath = `/${api}/${query.join('/')}`;  

      if (!this.isAllowedRoute(ADMIN_ROUTES, serverName, apiPath, req.method)) {
        throw new ForbiddenException('접근할 수 없는 경로입니다');
      }

      return this.gatewayService.forwardToService(serverName, fullPath, req, user, body);
    }
}  