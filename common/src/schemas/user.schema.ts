import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { Role } from '../enums/role.enum';
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

    @Prop({ ref: 'UserInfo' })
    userInfo: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
