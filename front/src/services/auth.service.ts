import axios from "axios";

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

    public async setNewPassword(oldPassword: String, newPassword: String)
    {
        const currentUser = this.getCurrentUser();
        if (oldPassword === newPassword || currentUser === null)
        {
            throw new Error("New password must be different from old password");
        }

        //const passwordSettings = await this.getUserPasswordSettings(currentUser.email);
        const userDataResponse = (await axios.post(API_URL + "new-password", {
            fullName: currentUser.fullName,
            email: currentUser.email,
            tokens: currentUser.tokens,
            isAdmin: currentUser.isAdmin,
            isFirstTime: currentUser.isFirstTime,
            password: newPassword,
        })).data;

        localStorage.setItem("user", JSON.stringify(userDataResponse));
    }

    public setUserPasswordSettings()
    {
        
    }

    public checkFirstTimeLogin()
    {
        const user = this.getCurrentUser();

        if (user && user.isFirstTime) {
            window.location.href = "/password-new";
        }
    }
}

export default new AuthService();