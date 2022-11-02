import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {UserDto} from "./dto";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async getUserById(id: number): Promise<UserDto> {
        const dbUser = await this.prisma.user.findUnique({
            where: {id}
        });
        const userDto: UserDto = {
            id: dbUser.id,
            fullName: dbUser.fullName,
            email: dbUser.email,
            isAdmin: dbUser.isAdmin,
            isFirstTime: dbUser.isFirstTime,
            createdAt: dbUser.createdAt,
            updatedAt: dbUser.updatedAt,
            randomNumber: dbUser.randomNumber,
        };
        console.log(userDto);
        return userDto;
    }

    async getUserByEmail(email: string): Promise<UserDto> {
        const dbUser = await this.prisma.user.findUnique({
            where: {email}
        });
        const userDto: UserDto = {
            id: dbUser.id,
            fullName: dbUser.fullName,
            email: dbUser.email,
            isAdmin: dbUser.isAdmin,
            isFirstTime: dbUser.isFirstTime,
            createdAt: dbUser.createdAt,
            updatedAt: dbUser.updatedAt,
            randomNumber: dbUser.randomNumber,
        };
        console.log(userDto);
        return userDto;
    }

    async getAllUsers(): Promise<UserDto[]> {
        const dbUsers = await this.prisma.user.findMany();
        const userDtos: UserDto[] = [];
        dbUsers.forEach(dbUser => {
            const userDto: UserDto = {
                id: dbUser.id,
                fullName: dbUser.fullName,
                email: dbUser.email,
                isAdmin: dbUser.isAdmin,
                isFirstTime: dbUser.isFirstTime,
                createdAt: dbUser.createdAt,
                updatedAt: dbUser.updatedAt,
                randomNumber: dbUser.randomNumber,
            };
            userDtos.push(userDto); 
        });
        return userDtos;
    }

    async createUser(data: any): Promise<any> {
        return await this.prisma.user.create({
            data
        });
    }

    async updateUser(id: number, data: any): Promise<any> {
        return await this.prisma.user.update({
            where: {id},
            data
        });
    }

    async deleteUser(id: number): Promise<boolean> {
        try {
            await this.prisma.user.delete({
                where: {id}
            });``
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

    async deleteUserByEmail(email: string): Promise<boolean> {
        console.log(email);
        try {
            const deleteUser = await this.prisma.user.delete({
                where: {
                    email: email
                },
            });
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

    async setOneTimePassword(email: string): Promise<any> {
        console.log(email);
        var random_number = Math.floor(Math.random() * 100);
        try {
            const updateUser = await this.prisma.user.update({
                where: {
                    email: email
                },
                data: {
                    oneTimeToken: (Math.log2(email.length * random_number).toFixed(5)).toString(),
                    randomNumber: random_number.toString()
                },
            });
            return random_number;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}