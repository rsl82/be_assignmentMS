import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isValidObjectId, Model } from "mongoose";
import { CreateEventDto } from "../dto/create-event.dto";
import { Event } from "common";

@Injectable()
export class EventService {
    constructor(
        @InjectModel(Event.name) private readonly eventModel: Model<Event>
    ) {}

    async createEvent(createEventDto: CreateEventDto): Promise<Event> {
        const event = await this.eventModel.create(createEventDto);
        return event;
    }
    
    async getEvents(): Promise<Event[]> {
        const events = await this.eventModel.find().select('title _id');
        return events;
    }

    async getEventById(id: string): Promise<Event> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('유효하지 않은 요청ID 입니다.');
        }
        const event = await this.eventModel.findById(id);
        if (!event) {
            throw new NotFoundException('존재하지 않는 이벤트입니다.');
        }
        return event;
    }

    
}