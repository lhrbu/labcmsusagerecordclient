import axios from "axios";
import MachineDownRecord from "../Models/MachineDownRecord";

export default class MachineDownRecordsWebAPI
{
    private _url = '/api/MachineDownRecords';
    public async PostAsync(record:MachineDownRecord)
    {
        await axios.post(this._url,record);
    }

    public async PutAsync(record:MachineDownRecord)
    {
        await axios.put(this._url,record);
    }

    public async GetAsync()
    {
        return (await axios.get(this._url,{params:{date:new Date()}})).data as MachineDownRecord[];
    }
}