import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthModule} from './auth/auth.module';
import {UserController} from './controllers/user.controller';
import {PrismaModule} from './prisma/prisma.module';
import {UserModule} from './user/user.module';
import {LogModule} from './log/log.module';
import {GoogleRecaptchaModule, GoogleRecaptchaNetwork} from "@nestlab/google-recaptcha";

@Module({
    imports: [
        GoogleRecaptchaModule.forRoot({
            secretKey: "6LfhUgwjAAAAAPqojy41iNup2O7gDC_byhFfQZmW",
            response: req => req.headers.recaptcha,
            network: GoogleRecaptchaNetwork.Recaptcha,
        }),
        AuthModule, PrismaModule, UserModule, LogModule],
    controllers: [AppController, UserController],
    providers: [AppService],
})
export class AppModule {
}
