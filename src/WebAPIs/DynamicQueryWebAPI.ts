import axios from "axios";

export default class DynamicQueryWebAPI
{
    private readonly _url = '/api/DynamicQuery';
    public async PostAsync(code:string)
    {
        
        return (await axios.post(this._url,code,
            {
                headers:{'Content-Type': 'application/json'},
                params:{date:new Date()}
            })).data as any[];
    }
}