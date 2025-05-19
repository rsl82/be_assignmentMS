import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { EventType, EventStatus } from "../enums";
import { Types } from "mongoose";

@Schema()
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true, enum: EventType })
  type: EventType;

  @Prop({ required: true })
  condition: string;

  @Prop({ required: true, enum: EventStatus, default: EventStatus.INACTIVE })
  status: EventStatus;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Reward" }] })
  rewards: Types.ObjectId[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
