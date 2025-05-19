import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Prop } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { RequestStatus } from "../enums";
@Schema()
export class Request {
    @Prop({ ref: 'User', required: true })
    user: Types.ObjectId;

    @Prop({ ref: 'Event', required: true })
    event: Types.ObjectId;
    
    @Prop({ required: true })
    status: RequestStatus;

    @Prop({ required: true, default: Date.now })
    requestDate: Date;
}
    

    

export const RequestSchema = SchemaFactory.createForClass(Request);