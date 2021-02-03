import User from "../Models/User";
import axios from 'axios';

export default class UsersWebAPI
{
    private readonly _url = '/api/Users';
    public async GetAsync()
    {
        return (await axios.get(this._url,{params:{date:new Date()}})).data as User[];
    }
}