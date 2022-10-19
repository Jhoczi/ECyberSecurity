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
                return response.data;
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
}

export default new AuthService();