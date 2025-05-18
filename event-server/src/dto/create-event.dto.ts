import { EventType, EventStatus } from "common";
import { IsString, IsDate, IsEnum, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class CreateEventDto {
    @IsString()
    title: string;
  
    @IsString()
    description: string;
  
    @IsDate()
    @Type(() => Date)
    startDate: Date;
  
    @IsDate()
    @Type(() => Date)
    endDate: Date;

    @IsEnum(EventType)
    type: EventType;
  
    @IsString()
    condition: string;
  
    @IsEnum(EventStatus)
    @IsOptional()
    status?: EventStatus;
}