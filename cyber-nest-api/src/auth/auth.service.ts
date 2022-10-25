import {ForbiddenException, Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {AuthDto, LoginDto, UserResponse} from './dto';
import * as bcrypt from 'bcrypt';
import {Tokens} from './types';
import {JwtService} from '@nestjs/jwt';
import {Pwd} from './dto/pwd.dto';
import {UserRequest} from './dto/user-request.dto';
import {response} from 'express';
import {LogService} from "../log/log.service";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private logService: LogService,
    ) {
    }

    hashData(data: string) {
        return bcrypt.hash(data, 10);
    }

    async getTokens(userId: number, email: string): Promise<Tokens> {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                {sub: userId, email},
                {secret: 'at-secret', expiresIn: 15 * 60},
            ),
            this.jwtService.signAsync(
                {sub: userId, email},
                {secret: 'rt-secret', expiresIn: 60 * 60 * 24 * 7},
            ),
        ]);
        return {
            accessToken: at,
            refreshToken: rt,
        };
    }

    async signupLocal(dto: AuthDto): Promise<Tokens> {
        await this.validateNewUserData(dto.password, dto.email);

        const hash = await this.hashData(dto.password);
        const newUser = await this.prisma.user.create({
            data: {
                fullName: dto.fullName,
                email: dto.email,
                hash,
                isAdmin: false,
                isFirstTime: true,
            },
        });
        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRtHash(newUser.id, tokens.refreshToken);

        await this.CreateLog(newUser, 'user created');

        return tokens;
    }

    async signinLocal(dto: LoginDto): Promise<UserResponse> {
        const user = await this.prisma.user.findUnique({
            where: {email: dto.email},
        });

        if (!user) throw new ForbiddenException('User not found');
        const passwordMatches = await bcrypt.compare(dto.password, user.hash);
        if (!passwordMatches) throw new ForbiddenException('Wrong password');

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refreshToken);
        const userResponse: UserResponse = {
            email: user.email,
            fullName: user.fullName,
            isAdmin: user.isAdmin,
            isFirstTime: user.isFirstTime,
            tokens: tokens,
        };

        await this.CreateLog(user, 'user logged in');

        return userResponse;
    }

    async logout(userId: number) {
        const result = await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRt: {
                    not: null,
                },
            },
            data: {
                hashedRt: null,
            },
        });

        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            }
        });
        await this.CreateLog(user, 'user logged out');

        return result;
    }

    async refreshTokens(userId: number, rt: string): Promise<Tokens> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

        const rtMatches = await bcrypt.compare(rt, user.hashedRt);
        if (!rtMatches) throw new ForbiddenException('Access Denied');

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refreshToken);

        return tokens;
    }

    async updateRtHash(userId: number, rt: string): Promise<void> {
        const hash = await this.hashData(rt);
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                hashedRt: hash,
            },
        });
    }

    // validation methods

    containsNumbers(str: string) {
        return /\d/.test(str);
    }

    containsSpecial(str: string) {
        return /[$&+,:;=?@#|\/\\_'<>.^*()%!-]/.test(str);
    }

    async validateNewUserData(password: string, email: string) {
        const passwordSettings = await this.prisma.passwordSettings.findFirst({});

        if (passwordSettings.oneDigit && !this.containsNumbers(password)) {
            throw new ForbiddenException('At least one number');
        }

        if (passwordSettings.oneSpecial && !this.containsSpecial(password)) {
            throw new ForbiddenException('At least one special character');
        }

        if (password.length < passwordSettings.passwordLength) {
            throw new ForbiddenException(
                `Expected password length should be greater than ${passwordSettings.passwordLength}`,
            );
        }
    }

    async validateUserData(
        oldPassword: string,
        newPassword: string,
        repeatNewPassword: string,
        userEmail: string,
    )
    {
        const passwordSettings = await this.prisma.passwordSettings.findFirst({});

        if (newPassword !== repeatNewPassword) {
            throw new ForbiddenException(
                'New Password and Repeat New Password do not match',
            );
        }

        if (passwordSettings.oneDigit && !this.containsNumbers(newPassword)) {
            throw new ForbiddenException('At least one number');
        }

        if (passwordSettings.oneSpecial && !this.containsSpecial(newPassword)) {
            throw new ForbiddenException('At least one special character');
        }

        if (newPassword.length < passwordSettings.passwordLength) {
            throw new ForbiddenException(
                `Expected password length should be greater than ${passwordSettings.passwordLength}`,
            );
        }

        const dbUser = await this.prisma.user.findFirst({
            where: {
                email: userEmail,
            },
        });

        if (!(await bcrypt.compare(oldPassword, dbUser.hash))) {
            throw new ForbiddenException('Old password is invalid.');
        }

        if (await bcrypt.compare(newPassword, dbUser.hash)) {
            throw new ForbiddenException('New password is the same as old one.');
        }
    }

    async updateUserPassword(userDto: UserRequest): Promise<UserResponse> {
        await this.validateUserData(
            userDto.oldPassword,
            userDto.newPassword,
            userDto.repeatNewPassword,
            userDto.email,
        );

        const user = await this.prisma.user.update({
            where: {
                email: userDto.email,
            },
            data: {
                isFirstTime: false,
                updatedAt: new Date(),
                hash: await this.hashData(userDto.newPassword),
            },
        });

        console.log(user);

        const tokens = await this.getTokens(user.id, user.email);
        const userResponse: UserResponse = {
            email: user.email,
            fullName: user.fullName,
            isAdmin: user.isAdmin,
            isFirstTime: user.isFirstTime,
            tokens: tokens,
        };

        await this.CreateLog(user, 'user update');

        return userResponse;
    }

    async getPasswordSettings(userEmail: string): Promise<Pwd> {
        const user = await this.prisma.user.findFirst({
            where: {
                email: userEmail,
            },
        });

        const pwdSettings = await this.prisma.passwordSettings.findFirst({});
        const expireDate: Date = new Date(
            user.pwdDateUpdate.getTime() +
            pwdSettings.passwordDaysDuration * 24 * 60 * 60 * 1000,
        );

        const result: Pwd = {
            expireAt: expireDate,
            passwordDaysDuration: pwdSettings.passwordDaysDuration,
            passwordLength: pwdSettings.passwordLength,
            oneDigit: pwdSettings.oneDigit,
            oneSpecial: pwdSettings.oneSpecial,

            userEmail: userEmail,
        };

        return result;
    }

    async setPasswordSettings(passwordDto: Pwd): Promise<Pwd> {
        const settings = await this.prisma.passwordSettings.update({
            where: {
                id: 1,
            },
            data: {
                passwordDaysDuration: passwordDto.passwordDaysDuration,
                passwordLength: passwordDto.passwordLength,
                oneDigit: passwordDto.oneDigit,
                oneSpecial: passwordDto.oneSpecial,
                updatedAt: new Date(),
            },
        });

        const user = await this.prisma.user.findFirst({
            where: {
                email: passwordDto.userEmail,
            },
        });

        console.log(new Date());
        console.log(settings);

        const expireDate: Date = new Date(
            user.pwdDateUpdate.getTime() +
            settings.passwordDaysDuration * 24 * 60 * 60 * 1000,
        );
        const result: Pwd = {
            expireAt: expireDate,
            passwordDaysDuration: settings.passwordDaysDuration,
            passwordLength: settings.passwordLength,
            oneDigit: settings.oneDigit,
            oneSpecial: settings.oneSpecial,
            userEmail: passwordDto.userEmail,
        };

        console.log(result);
        await this.CreateLog(user, 'password settings update');

        return result;
    }

    private async CreateLog(model: any, action: string) {
        let message: string;

        switch (action) {
            case 'user logged in':
                message = `User ${model.email} logged in`;
                break;
            case 'user logged out':
                message = `User ${model.email} logged out`;
                break;
            case 'user create':
                message = `User ${model.email} created`;
                break;
            case 'user update':
                message = `User ${model.email} updated`;
                break;
            case 'user delete':
                message = `User ${model.email} deleted`;
                break;
            case 'password settings change':
                message = `User ${model.email} changed password settings`;
                break;
        }

        if (message === "")
            throw new Error("Action not found");

        await this.logService.createLog({
            userId: model.id,
            action: 'User created',
            description: `User ${model.fullName} created`,
            username: model.fullName,
        });
    }
}
