import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/test/";

class UserService
{
    public getPublicContent()
    {
        return axios.get(API_URL + "all");
    }

    public getUserBoard()
    {
        return axios.get(API_URL + 'user', { headers: authHeader() });
    }

    public getModeratorBoard()
    {
        return axios.get(API_URL + "mod", { headers: authHeader() });
    }

    public getAdminBoard()
    {
        return axios.get(API_URL + "admin", { headers: authHeader()});
    }
}

export default new UserService();