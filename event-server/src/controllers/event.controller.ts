import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { EventService } from "src/services/event.service";
import { CreateEventDto } from "../dto/create-event.dto";
import { CreateRewardDto } from "../dto/create-reward.dto";
import { CreateRequestDto } from "../dto/create-request.dto";
import { UserHeader } from "src/decorators/user-header.decorator";

@Controller()
export class EventController {
    constructor(private readonly eventService: EventService) {}

    @Post('event')
    async createEvent(@Body() createEventDto: CreateEventDto) {
        const event = await this.eventService.createEvent(createEventDto);
        return event;
    }

    @Get('event')
    async getEvents() {
        const events = await this.eventService.getEvents();
        return events;
    }

    @Get('event/:id')
    async getEventById(@Param('id') id: string) {
        const event = await this.eventService.getEventById(id);
        return event;
    }

    @Post('reward')
    async createReward(@Body() createRewardDto: CreateRewardDto) {
        const reward = await this.eventService.createReward(createRewardDto);
        return reward;
    }

    @Post('request')
    async createRequest(@Body() createRequestDto: CreateRequestDto, @UserHeader('id') userId: string) {
        const request = await this.eventService.createRequest(createRequestDto, userId);
        return request;
    }
    
}