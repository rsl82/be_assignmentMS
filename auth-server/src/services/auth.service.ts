import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../schemas/user.schema";
import * as bcrypt from "bcrypt";
import { Role } from "common";
import { LoginUserDto } from "src/dto/login-user.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly jwtService: JwtService
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


    async login(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;

        const user = await this.findUserByEmail(email);
        
        if (!user || !await bcrypt.compare(password, user?.password)) {
            throw new UnauthorizedException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
        
        return this.generateToken(user._id.toString(), user.email, user.role);
    }

    private async generateToken(id: string, email: string, role: Role) {
        const payload = { id, email, role };
        return this.jwtService.sign(payload);
    }
}