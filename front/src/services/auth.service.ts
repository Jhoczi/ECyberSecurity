import axios from "axios";
import IPwd from "../types/pwd-type";
import ILog from "../types/log-type";

const API_URL = "http://localhost:3000/auth/local/";

class AuthService
{
    public login (email: string, password: string)
    {
        return axios
            .post(API_URL + "signin", {
                email,
                password
            })
            .then(response => {
                if (response.data.tokens)
                {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }
            });
    }

    public logout()
    {
        localStorage.removeItem("user");
        localStorage.removeItem("passwordSettings");
    }

    public register(fullName: string, email: string, password: string)
    {
        return axios
            .post(API_URL + "signup", {
                fullName,
                email,
                password
            });
    }

    public getCurrentUser()
    {
        const userStr = localStorage.getItem("user");
        if (userStr)
            return JSON.parse(userStr);

        return null;
    }

    public getCurrentUserPasswordSettings()
    {
        const pwdStr = localStorage.getItem("passwordSettings");
        if (pwdStr)
            return JSON.parse(pwdStr);
        return null;
    }

    public async getUserPasswordSettings(email: string)
    {
        const response = await axios
            .post(API_URL + "password", {
                email
            });

        localStorage.setItem("passwordSettings", JSON.stringify(response.data));
    }

    public async setNewPassword(oldPassword: String, newPassword: String, repeatNewPassword: String)
    {
        const currentUser = this.getCurrentUser();
        if (oldPassword === newPassword || currentUser === null)
        {
            throw new Error("New password must be different from old password");
        }

        if (newPassword !== repeatNewPassword)
        {
            throw new Error("New password and repeat new password must be the same");
        }

        //const passwordSettings = await this.getUserPasswordSettings(currentUser.email);
        const userDataResponse = (await axios.post(API_URL + "new-password", {
            fullName: currentUser.fullName,
            email: currentUser.email,
            tokens: currentUser.tokens,
            isAdmin: currentUser.isAdmin,
            isFirstTime: currentUser.isFirstTime,
            newPassword: newPassword,
            oldPassword: oldPassword,
            repeatNewPassword: repeatNewPassword,
        })).data;

        localStorage.setItem("user", JSON.stringify(userDataResponse));
    }

    public async setUserPasswordSettings(pwdSettings: any)
    {
        const user = this.getCurrentUser();

        const response = (await axios.post(API_URL + "new-password-settings", {
            passwordLength: pwdSettings.passwordLength,
            passwordDaysDuration: pwdSettings.passwordExpiration,
            oneSpecial: pwdSettings.specialCharacter,
            oneDigit: pwdSettings.oneDigit,
            userEmail: user.email,
            timeoutMinutes: pwdSettings.timeoutMinutes,
            maxAttempts: pwdSettings.maxAttempts
        })).data;

        localStorage.setItem("passwordSettings", JSON.stringify(response));
    }

    public async getUsersList()
    {
        const response = (await axios.get("http://localhost:3000/user/local/all")).data;
        console.log(response);

        return response;
    }

    public checkFirstTimeLogin()
    {
        const user = this.getCurrentUser();

        if (user && user.isFirstTime) {
            window.location.href = "/password-new";
        }
    }

    public async deleteUser(email: string)
    {
        await axios.delete(`http://localhost:3000/user/${email}`);
    }

    public async setOneTimePassword(email: string)
    {
        await axios.get(`http://localhost:3000/user/onetimepassword/${email}`);
    }

    public async getLogs()
    {
        const response = (await axios.get("http://localhost:3000/logs")).data;
        const result:ILog[] = response;

        return result;
    }
}

export default new AuthService();