import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class LogService {
    constructor(private prisma: PrismaService) {

    }

    async getLogs(): Promise<any> {

        const logs = await this.prisma.log.findMany();
        return logs;
    }

    async getLogById(id: number): Promise<any> {
        const log = await this.prisma.log.findUnique({
            where: {id}
        });
        return log;
    }

    async getLogByUserId(id: number): Promise<any> {
        const log = await this.prisma.log.findFirst({
            where: {
                userId: id
            }
        });
        return log;
    }

    async getLogByUserEmail(email: string): Promise<any> {

        const user = await this.prisma.user.findUnique({
            where: {
                email: email
            }
        });
        const log = await this.prisma.log.findFirst({
            where: {
                userId: user.id
            }
        });
        return log;
    }

    async createLog(model: any): Promise<any> {
        const log = await this.prisma.log.create({
            data: model
        });
        return log;
    }

    async deleteLog(id: number): Promise<any> {
        const log = await this.prisma.log.delete({
            where: {
                id: id
            }
        });
        return log;
    }
}
