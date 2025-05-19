import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class UserInfo {
  @Prop({ default: null })
  birthDate: Date;

  @Prop({ default: 0 })
  attendanceStreak: number;

  @Prop({ default: null })
  lastAttendance: Date;

  @Prop({ ref: "User", required: true })
  user: Types.ObjectId;
}

export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);
