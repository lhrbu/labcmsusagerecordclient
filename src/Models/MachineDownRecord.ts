export default class MachineDownRecord
{
    public Id:number=0;
    public UserId : string | null = null;
    public EquipmentNo: string | null = null;
    public MachineDownDate : number = 0;
    public Comment: string | null = null;
    public MachineRepairedDate :number | null = 0;
    public static GetDuration(record:MachineDownRecord)
    {
        if(record.MachineRepairedDate && record.MachineRepairedDate>record.MachineDownDate)
        { return record.MachineRepairedDate-record.MachineDownDate;}
        else{return null;}
    }
}