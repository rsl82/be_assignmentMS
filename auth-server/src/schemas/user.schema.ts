import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { Role } from 'common';

@Schema()
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, enum: Role, default: Role.USER })
    role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
