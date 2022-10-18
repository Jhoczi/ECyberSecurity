import { Controller, Get, HttpCode } from "@nestjs/common";

@Controller("users")
export class UserController
{
    constructor() {}

    @Get()
    @HttpCode(200)
    getPublicContent()
    {
        return "Public Content."
    }

    @Get()
    @HttpCode(200)
    getUserContent()
    {
        return "User Content."
    }

    @Get()
    @HttpCode(200)
    getAdminContent()
    {
        return true;
    }
}