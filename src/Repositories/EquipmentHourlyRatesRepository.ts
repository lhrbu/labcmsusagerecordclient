import EquipmentHourlyRate from "../Models/EquipmentHourlyRate";
import EquipmentHourlysRatesWebAPI from "../WebAPIs/EquipmentHourlyRatesWebAPI";

export default class EquipmentHourlyRatesRepository
{
    private static _instance = new EquipmentHourlyRatesRepository();
    private constructor(){}
    public static get Instance(){return this._instance;}

    public async LoadAsync()
    {
        const webAPI = new EquipmentHourlysRatesWebAPI();
        this._equipmentHourlyRates = await webAPI.GetAsync();
    }

    private _equipmentHourlyRates:EquipmentHourlyRate[] = [];
    public get EquipmentHourlyRates(){return this._equipmentHourlyRates;}

    public ContainsNo(equipmentNo:string)
    {
        return this.EquipmentHourlyRates.some(item=>item.EquipmentNo===equipmentNo);
    }
}