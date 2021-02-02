import React,{Fragment, useEffect, useState} from 'react';
import { Table,Modal, Button} from 'antd';
import TimeStampStringConverter from "../Services/TimeStampConverter";
import MachineDownRecordsWebAPI from "../WebAPIs/MachineDownRecordsWebAPI";
import UsageRecordsWebAPI from "../WebAPIs/UsageRecordsWebAPI";
import MachineDownRecord from '../Models/MachineDownRecord';
import moment from 'moment';
const distinct = require('distinct');
const {Column} = Table;
const _pageSize = 20;

export default function MachineDownRecords()
{
    const _usageRecordsWebAPI = new UsageRecordsWebAPI();
    const _machineDownRecordsWebAPI =new MachineDownRecordsWebAPI();
    const _timeStampStringConverter = new TimeStampStringConverter();
    const [tableLoading,setTableLoading]=useState<boolean>(true);
    const [currentPageIndex,setCurrentPageIndex]=useState<number>(1);
    const [machineDownRecords,setMachineDownRecords]= useState<MachineDownRecord[]>([]);

    const [inEditing,setInEditing]=useState<boolean>(false);
    const [selectedRecord,setSelectedRecord]=useState<MachineDownRecord|null>(null);

    useEffect(()=>{
        FetchMachineDownRecords()},[]);

    return (
        <Fragment>
            <div className="HeaderBar">HJL-NL-TI-V Machine down record {moment().year()}</div>
            <Table dataSource={machineDownRecords}
                loading={tableLoading}
                rowKey="Id"
                pagination={{position:["bottomCenter"],defaultPageSize:_pageSize,current:currentPageIndex,
                            onChange:index=>setCurrentPageIndex(index)}}
                rowSelection={{
                    type:"radio",
                    hideSelectAll:true,
                    onSelect:setSelectedRecord
                    }}
                bordered 
                size='small'>
                <Column title="User Id" dataIndex="UserId"
                    filters={GenerateFilterOptions(machineDownRecords.filter(item=>item.UserId?true:false).map(item=>item.UserId!))}
                    onFilter={(value, record) => (record as MachineDownRecord).UserId === value }/>
                <Column title="Equipment No" dataIndex="EquipmentNo"
                    filters={GenerateFilterOptions(machineDownRecords.filter(item=>item.EquipmentNo?true:false).map(item=>item.EquipmentNo!))}
                    onFilter={(value, record) => (record as MachineDownRecord).EquipmentNo === value }/>
                <Column title="Machine Down Date" dataIndex="MachineDownDate" 
                    render={timeStampValue=>timeStampValue?_timeStampStringConverter.FromUnixTimeSeconds(timeStampValue as number):null}/>
                <Column title="Comment" dataIndex="Comment" />
                <Column title="Machine Repaired Date" dataIndex="MachineRepairedDate" 
                    render={timeStampValue=>timeStampValue?_timeStampStringConverter.FromUnixTimeSeconds(timeStampValue as number):null}/>
                <Column title="Duration" 
                    render={(_,record)=>record?GetAndRenderDuration(record as MachineDownRecord):null}/>
            </Table>

            <Button type='primary' disabled={selectedRecord?false:true}
                onClick={ConfirmRepairedDateAsync}>Update</Button>
            <Button type="primary" danger disabled={selectedRecord?false:true}
                onClick={CancelRepairedDateAsync} style={{marginLeft:'4px'}}>
                Reset
            </Button>
        </Fragment>
    );

    async function FetchMachineDownRecords()
    {
        const machineDownRecords = await _machineDownRecordsWebAPI.GetAsync();
        setMachineDownRecords([...machineDownRecords]);
        setCurrentPageIndex(GetPageCount(machineDownRecords.length,_pageSize));
        setTableLoading(false);
    }

    async function ConfirmRepairedDateAsync()
    {
        setInEditing(true);
        try {
            const repairedDateString = window.prompt(`Input Equipment ${selectedRecord?.EquipmentNo} repaired date in yyyy/MM/dd HH:mm format`);
            if (repairedDateString) {
                const repairedDate = _timeStampStringConverter.ToUnixTimeSeconds(repairedDateString);
                if(repairedDate > selectedRecord!.MachineDownDate)
                {   
                    const index = machineDownRecords.findIndex(record=>record.Id===selectedRecord!.Id) ;
                    machineDownRecords[index].MachineRepairedDate = repairedDate;
                    await _machineDownRecordsWebAPI.PutAsync(machineDownRecords[index]);
                    setMachineDownRecords([...machineDownRecords]);
                    setSelectedRecord(null);
                }else{
                    throw new Error('Error: Input Repaired date is early than down date!');
                }
            }
        }catch(error)
        {
            window.alert(error);
        }
        finally { setInEditing(false); }
    }

    async function CancelRepairedDateAsync()
    {
        setInEditing(true);
        try {
            if(window.confirm(`Sure to set Equipment ${selectedRecord?.EquipmentNo} as not repaired yet?`))
            {
                const index = machineDownRecords.findIndex(record=>record.Id===selectedRecord!.Id);
                machineDownRecords[index].MachineRepairedDate = null;
                await _machineDownRecordsWebAPI.PutAsync(machineDownRecords[index]);
                setMachineDownRecords([...machineDownRecords]);
                setSelectedRecord(null);
            }
        }catch(error)
        {
            window.alert(error);
        }
        finally { setInEditing(false); }
    }
}

function GetPageCount(num: number, pageSize: number)
{
    return num % pageSize === 0 ? Math.floor(num / pageSize) : Math.ceil(num / pageSize);
}

function GetAndRenderDuration(record: MachineDownRecord)
{
    const duration = MachineDownRecord.GetDuration(record);
    if(duration){
    return Number.isInteger(duration) ? duration : duration.toFixed(2);
    }else{return ""}
}

function GenerateFilterOptions<TOption>(optionValues: TOption[])
{
    return (distinct(optionValues) as TOption[]).sort().map(optionValue => { return { text: optionValue, value: optionValue } });
}