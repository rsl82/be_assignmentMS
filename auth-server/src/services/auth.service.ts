import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../schemas/user.schema";
import * as bcrypt from "bcrypt";
import { Role } from "common";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<User> {

        if(await this.findUserByEmail(createUserDto.email)) {
            throw new ConflictException("User already exists");
        }

        const hashedPassword = await this.hashPassword(createUserDto.password);

        const user = await this.userModel.create({
            email: createUserDto.email,
            password: hashedPassword,
            role: Role.USER
        });

        return user;
    }

    private async findUserByEmail(email: string): Promise<User | null> {
        return await this.userModel.findOne({ email });
    }

    private async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }
}