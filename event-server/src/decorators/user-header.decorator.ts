import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserHeader {
    id: string;
    email: string;
    role: string;
}

export const UserHeader = createParamDecorator(
    (data: keyof UserHeader | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const headers = request.headers;

        const userHeader: UserHeader = {
            id: headers['x-user-id'],
            email: headers['x-user-email'],
            role: headers['x-user-role']
        };

        return data ? userHeader[data] : userHeader;
    },
);