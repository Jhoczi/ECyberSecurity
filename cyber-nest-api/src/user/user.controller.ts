import {Controller, Delete, Get, HttpCode, HttpStatus, Param} from "@nestjs/common";
import {UserService} from "./user.service";

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get("local/all")
    @HttpCode(HttpStatus.OK)
    async getAllUsers() {
        return this.userService.getAllUsers();
    }

    // delete user by email
    @Delete(":email")
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUserByEmail(@Param() params) {
        return this.userService.deleteUserByEmail(params.email);
    }

    @Get("onetimepassword/:email")
    async setOneTimePassword(@Param() params) {
        return this.userService.setOneTimePassword(params.email);
    }
}