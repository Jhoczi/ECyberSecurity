import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3000/user/";

class UserService
{
    public getPublicContent()
    {
        return axios.get(API_URL + "all");
    }

    public getUserBoard()
    {
        return axios.get(API_URL + 'current', { headers: authHeader() });
    }

    public getAdminBoard()
    {
        return axios.get(API_URL + "admin", { headers: authHeader()});
    }
}

export default new UserService();