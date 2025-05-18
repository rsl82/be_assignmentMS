import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { Role, ChangeRoleDto, CreateUserDto, LoginUserDto, User } from "common";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly jwtService: JwtService
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<User> {

        if(await this.findUserByEmail(createUserDto.email)) {
            throw new ConflictException("해당 메일의 유저가 이미 존재합니다.");
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


    async login(loginUserDto: LoginUserDto): Promise<string> {
        const { email, password } = loginUserDto;

        const user = await this.findUserByEmail(email);
        
        if (!user || !await bcrypt.compare(password, user?.password)) {
            throw new UnauthorizedException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        return this.generateToken(user._id.toString(), user.email, user.role);

    }

    private generateToken(id: string, email: string, role: Role): string {
        const payload = { id, email, role };
        return this.jwtService.sign(payload);
    }

    async changeRole(changeRoleDto: ChangeRoleDto): Promise<boolean> {
        const { email, role } = changeRoleDto;

        const user = await this.findUserByEmail(email);

        if(!user) {
            throw new NotFoundException("해당 유저를 찾을 수 없습니다.");
        }

        await this.userModel.updateOne({email}, {$set: {role}});

        return true;
    }
}