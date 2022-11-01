import { Module } from '@nestjs/common';
import {LogService} from "./log.service";
import {LogController} from "./log.controller";

@Module({
    imports: [],
    controllers: [LogController],
    providers: [LogService],
})
export class LogModule {}
