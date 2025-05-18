import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class UserInfo {
    @Prop()
    birthDate: Date;

    @Prop()
    attendanceStreak: number;

    @Prop()
    lastAttendance: Date;

    @Prop({ ref: 'User', required: true })
    user: Types.ObjectId;
}

export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);