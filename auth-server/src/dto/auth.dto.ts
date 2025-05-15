import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class AuthDto {
  @IsNotEmpty({message: '이메일을 입력해주세요.'})
  @IsEmail({},{message: '유효한 이메일이 아닙니다.'})
  email: string;


  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @MinLength(10, { message: '비밀번호는 최소 10자 이상이어야 합니다.' })
  @MaxLength(20, { message: '비밀번호는 최대 20자 이하여야 합니다.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/, {
    message: '비밀번호는 영문자, 숫자, 특수문자를 각각 최소 1개 이상 포함해야 합니다.',
  })
  password: string;
}
