import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { Role } from 'common';
import { Types } from 'mongoose';
@Schema()
export class User {

    readonly _id: Types.ObjectId;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, enum: Role, default: Role.USER })
    role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
