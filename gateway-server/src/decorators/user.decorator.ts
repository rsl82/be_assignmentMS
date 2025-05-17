import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { JwtPayload } from "src/interfaces/jwt-payload.interface";


export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as JwtPayload | undefined;
  },
);
