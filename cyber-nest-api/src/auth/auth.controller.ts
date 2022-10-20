import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto, UserResponse, Pwd } from './dto';
import { Tokens } from './types';
import { AtGuard, RtGuard } from '../common/guards';
import { GetCurrentUser } from '../common/decorators';
import { UserRequest } from './dto/user-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signupLocal(dto);
  }

  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() dto: LoginDto): Promise<UserResponse> {
    return this.authService.signinLocal(dto);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUser('sub') userId: number) {
    return this.authService.logout(userId);
  }

  // @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUser('sub') userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    console.log({ userId, refreshToken });
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post("local/password")
  @HttpCode(HttpStatus.OK)
  getPasswordSettings(@Body("email") email: string): Promise<Pwd> {
    return this.authService.getPasswordSettings(email);
  }

  @Post("local/new-password")
  @HttpCode(HttpStatus.OK)
  async setUserPassword(@Body() model: UserRequest): Promise<UserResponse>
  {
    return await this.authService.updateUserPassword(model);
  }

  @Post("local/new-password-settings")
  @HttpCode(HttpStatus.OK)
  async setPasswordSettings(@Body() model: Pwd): Promise<Pwd>
  {
    const result = await this.authService.setPasswordSettings(model);
    return result;
  }
}
