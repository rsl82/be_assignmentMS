import { EventService } from "src/services/event.service";

export class EventController {
    constructor(private readonly eventService: EventService) {}
}