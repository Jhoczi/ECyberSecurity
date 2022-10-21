/* eslint-disable */
import {IsEmail, IsNotEmpty, IsString, Length, Matches} from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  fullName: string
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
