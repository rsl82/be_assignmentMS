import { Module } from '@nestjs/common';
import { EventController } from './controllers/event.controller';
import { EventService } from './services/event.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema, Reward, RewardSchema, Request, RequestSchema} from 'common';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
  MongooseModule.forRootAsync({
    useFactory: (configService: ConfigService) => ({
      uri: configService.get('MONGO_URI'),
    }),
    inject: [ConfigService],
  }),
  MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }]),
  MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class AppModule {}
