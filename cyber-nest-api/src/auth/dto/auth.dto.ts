import {IsEmail, IsNotEmpty, IsString, Length, Matches} from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  fullName: string
  @IsNotEmpty()
  @IsEmail()
  @Matches(/^(?=.*[a-z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$.@!%&*?]{12,}$/)
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}