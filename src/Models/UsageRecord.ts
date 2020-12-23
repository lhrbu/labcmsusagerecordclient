import EquipmentHourlyRate from "./EquipmentHourlyRate";
import Project from "./Project";

export default class UsageRecord
{
    public Id:number = 0;
    public User:string | null = null;
    public TestNo : string | null = null;
    public EquipmentNo :  string | null = null;
    //public EquipmentHourlyRate:EquipmentHourlyRate |null=null;
    public TestType:string | null = null;
    public ProjectNo:string | null = null;
    //public Project:Project | null = null;
    public StartTime : number = 0;
    public EndTime : number =0;

    public static GetDuration(usageRecord:UsageRecord)
    {
        if(usageRecord.StartTime!=null && usageRecord.EndTime!=null){
            return (usageRecord.EndTime - usageRecord.StartTime)/3600
        }else{
            throw new Error(`${usageRecord.TestNo} with wrong Timestamp format`);
        }
    }
}