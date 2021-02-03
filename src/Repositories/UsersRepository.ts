import User from "../Models/User";
import MachineDownRecordsWebAPI from "../WebAPIs/MachineDownRecordsWebAPI";
import UsersWebAPI from "../WebAPIs/UsersWebAPI";


export default class UsersRepository
{
    private static _instance:UsersRepository = new UsersRepository();
    private constructor(){}
    public static get Instance(){ return this._instance;}

    public async LoadAsync()
    {
        const webAPI = new UsersWebAPI();
        this._users =await webAPI.GetAsync();
    }
    private _users:User[] = [];
    public get Users(){return this._users;}

    public ContainsId(userId:string)
    {
        return this._users.some(item=>item.UserId===userId);
    }
}