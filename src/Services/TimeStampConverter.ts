import moment from "moment";

export default class TimeStampStringConverter
{
    public ToUnixTimeSeconds(dateTimeString:string,timeFormat:string='yyyy/MM/DD HH:mm')
    {
        return moment(dateTimeString,timeFormat).unix();
    }
    public FromUnixTimeSeconds(timeStamp:number,timeFormat:string='yyyy/MM/DD HH:mm')
    {
        return moment(timeStamp*1000).format(timeFormat);
    }

    private readonly _timeFormatPattern = /^\d{4}\/\d{1,2}\/\d{1,2}\s\d{1,2}:\d{1,2}$/;
    public get TimeFormatPattern():RegExp {
        return this._timeFormatPattern;
    }
}