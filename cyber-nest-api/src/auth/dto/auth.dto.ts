import {IsEmail, IsNotEmpty, IsString, Length, Matches} from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
  @Matches(/^(?=.*[a-z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$.@!%&*?]{12,}$/)
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
