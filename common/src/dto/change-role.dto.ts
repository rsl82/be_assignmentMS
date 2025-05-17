import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { Role } from "../enums";

export class ChangeRoleDto {

    @IsNotEmpty({message: '이메일을 입력해주세요.'})
    @IsEmail({},{message: '유효한 이메일이 아닙니다.'})   
    email: string;

    @IsNotEmpty({message: '역할을 입력해주세요.'})
    @IsEnum(Role, {message: '유효한 역할이 아닙니다.'})
    role: Role;
}