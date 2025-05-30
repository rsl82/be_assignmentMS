import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role, User, UserInfo } from 'common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { ChangeRoleDto } from '../dto/change-role.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(UserInfo.name) private readonly userInfoModel: Model<UserInfo>,
    private readonly jwtService: JwtService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    if (await this.findUserByEmail(createUserDto.email)) {
      throw new ConflictException('해당 메일의 유저가 이미 존재합니다.');
    }

    const hashedPassword = await this.hashPassword(createUserDto.password);

    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      const user = await this.userModel.create(
        [
          {
            email: createUserDto.email,
            password: hashedPassword,
            role: Role.USER,
          },
        ],
        { session },
      );

      const userInfo = await this.userInfoModel.create(
        [
          {
            user: user[0]._id,
          },
        ],
        { session },
      );

      user[0].userInfo = userInfo[0]._id;
      await user[0].save({ session });

      await session.commitTransaction();
      session.endSession();

      return user[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
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

    if (!user || !(await bcrypt.compare(password, user?.password))) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
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

    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    }

    await this.userModel.updateOne({ email }, { $set: { role } });

    return true;
  }
}
