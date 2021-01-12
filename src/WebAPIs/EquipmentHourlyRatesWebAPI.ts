import axios from "axios";
import EquipmentHourlyRate from "../Models/EquipmentHourlyRate";

export default class EquipmentHourlysRatesWebAPI
{
    private readonly _url = '/api/EquipmentHourlyRates';

    public async GetAsync()
    {
        return (await axios.get(this._url,{params:{date:new Date()}})).data as EquipmentHourlyRate[];
    }

    public async PostAsync(equipmentHourlyRate:EquipmentHourlyRate)
    {
        await axios.post(this._url,equipmentHourlyRate,{params:{date:new Date()}});
    }
    public async PutAsync(equipmentHourlyRate:EquipmentHourlyRate)
    {
        await axios.put(this._url,equipmentHourlyRate,{params:{date:new Date()}});
    }
    public async DeleteByNoAsync(no:string)
    {
        const noUrl = `${this._url}/${encodeURIComponent(no)}`;
        return await axios.delete(noUrl);
    }
}