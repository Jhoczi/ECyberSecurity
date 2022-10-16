import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

class AuthService
{
    public login (username: string, password: string)
    {
        return axios
            .post(API_URL + "signin", {
                username,
                password
            })
            .then(response => {
                if (response.data.accessToken)
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

    public register(username: string, email: string, password: string)
    {
        return axios
            .post(API_URL + "signup", {
                username,
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