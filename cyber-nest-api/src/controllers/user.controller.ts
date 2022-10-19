import { Controller, Get, HttpCode } from "@nestjs/common";

@Controller("user")
export class UserController
{
    constructor() {}

    @Get("all")
    @HttpCode(200)
    getPublicContent()
    {
        return "Public Content."
    }

    @Get("current")
    @HttpCode(200)
    getUserContent()
    {
        return "User Content."
    }

    @Get("admin")
    @HttpCode(200)
    getAdminContent()
    {
        return true;
    }
}