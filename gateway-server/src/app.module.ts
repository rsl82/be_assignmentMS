import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { GatewayController } from './controllers/gateway.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GatewayService } from './services/gateway.service';
import { HttpModule } from '@nestjs/axios';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}),
    PassportModule.register({defaultStrategy: 'jwt'}),
    HttpModule,
  ],
  controllers: [GatewayController],
  providers: [GatewayService, JwtStrategy, RolesGuard],
})
export class AppModule {}
