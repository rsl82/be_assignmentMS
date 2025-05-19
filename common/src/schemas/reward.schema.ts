import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { RewardType } from "../enums";
import { Types } from "mongoose";
@Schema()
export class Reward {
  @Prop({ required: true, enum: RewardType })
  type: RewardType;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ ref: "Event", required: true })
  event: Types.ObjectId;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
