import {IsEmail, IsNotEmpty, IsString, Length, Matches} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsNotEmpty()
  @IsString()
  token: string;
  @IsNotEmpty()
  @IsString()
  visCaptcha: string;
  @IsNotEmpty()
  @IsString()
  ourCaptcha: string;
}
