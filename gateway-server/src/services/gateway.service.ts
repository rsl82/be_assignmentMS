import { Injectable, NotFoundException, BadGatewayException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import fetch from 'node-fetch';


@Injectable()
export class GatewayService {
  constructor(private readonly configService: ConfigService) {}


  async forwardToService(
    serverName: string,
    path: string,
    request: Request,
    user?: JwtPayload,
    body?: any,
  ): Promise<any> {
    const serverUrl = this.configService.get<string>(`${serverName}_URL`);
    if (!serverUrl) {
      throw new NotFoundException(`서버 ${serverName}를 찾을 수 없습니다`);
    }

    const fullUrl = new URL(path, serverUrl).toString();
    const headers = {
      'Content-Type': 'application/json',
      ...this.prepareHeaders(request.headers, user)
    };

    try {
      const response = await fetch(fullUrl, {
        method: request.method,
        headers,
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          statusCode: response.status,
          message: data.message,
          error: data.error
        };
      }

      return data;
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      console.error('Error details:', error);
      throw new BadGatewayException(`서버 ${serverName}에 연결할 수 없습니다`);
    }
  }


  private prepareHeaders(
    originalHeaders: Record<string, any>,
    user?: JwtPayload,
  ): Record<string, string> {
    const { host, connection, ...headers } = originalHeaders;
    
    return user ? {
      ...headers,
      'x-user-id': user.id,
      'x-user-email': user.email,
      'x-user-role': user.role.toString()
    } : headers;
  }
}