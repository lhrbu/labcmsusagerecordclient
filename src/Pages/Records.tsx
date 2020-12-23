import React,{Fragment, useEffect, useState} from 'react';
import { Table,Modal, Button} from 'antd';
import UsageRecord from '../Models/UsageRecord';
import UsageRecordsWebAPI from '../WebAPIs/UsageRecordsWebAPI';
import UsageRecordEditor from '../Components/UsageRecordEditor';
import UsageRecordLocalCacheService from '../Services/UsageRecordLocalCacheService';
import Moment from 'moment';
import './HeaderBar.css';
import TimeStampStringConverter from '../Services/TimeStampConverter';
import ProjectsRepository from '../Repositories/ProjectsRepository';

const distinct = require('distinct');
const {Column} = Table;
const _pageSize = 12;

export default function Records()
{
    const _usageRecordsWebAPI = new UsageRecordsWebAPI();
    const _timeStampStringConverter = new TimeStampStringConverter();

    const [tableLoading,setTableLoading]=useState<boolean>(true);
    const [currentPageIndex,setCurrentPageIndex]=useState<number>(1);
    const [usageRecords,setUsageRecords] = useState<UsageRecord[]>([]);

    const [inEditing,setInEditing]=useState<boolean>(false);
    const [selectedRecord,setSelectedRecord]=useState<UsageRecord | null>(null);

    useEffect(()=>{
        FetchUsageRecords();
    },[]);

    return (
        <Fragment>
            <div className="HeaderBar">HJL-NL-TI-V Test equipment usage record {Moment().year()}</div>
            <Table dataSource={usageRecords}
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
                size='small'
            >
                 <Column title="User" dataIndex="User"
                    filters={GenerateFilterOptions(usageRecords.filter(item=>item.User?true:false).map(item=>item.User!))}
                    onFilter={(value, record) => (record as UsageRecord).User === value }
                    />
                <Column title="Test No" dataIndex="TestNo"
                    filters={GenerateFilterOptions(usageRecords.filter(item=>item.TestNo?true:false).map(item=>item.TestNo!))}
                    onFilter={(value, record) => (record as UsageRecord).TestNo === value }
                    />
                <Column title="Equipment No" dataIndex="EquipmentNo"
                    filters={GenerateFilterOptions(usageRecords.filter(item=>item.EquipmentNo?true:false).map(item=>item.EquipmentNo!))}
                    onFilter={(value, record) => (record as UsageRecord).EquipmentNo === value }
                    />
                <Column title="Project Name" 
                    render={(_,usageRecord)=>usageRecord?ProjectsRepository.Instance.FindFullNameByProjectNo(
                        (usageRecord as UsageRecord)!.ProjectNo!):null}/>
                <Column title="Test Type" dataIndex="TestType"
                    filters={GenerateFilterOptions(usageRecords.filter(item=>item.TestType?true:false).map(item=>item.TestType!))}
                    onFilter={(value, record) => (record as UsageRecord).TestType === value }
                    />
                <Column title="Start Time" dataIndex="StartTime" 
                    render={timeStampValue=>timeStampValue?_timeStampStringConverter.FromUnixTimeSeconds(timeStampValue as number):null}/>
                <Column title="End Time" dataIndex="EndTime" 
                    render={timeStampValue=>timeStampValue?_timeStampStringConverter.FromUnixTimeSeconds(timeStampValue as number):null}/>
                <Column title="Duration" 
                    render={(_,usageRecord)=>usageRecord?GetAndRenderDuration(usageRecord as UsageRecord):null}/>
            </Table>

            <Modal
                getContainer={false}
                visible={inEditing}
                title="Edit Usage Record"
                onCancel={()=>setInEditing(false)}
                footer={[
                    <Button key="close" type="default" danger
                        onClick={()=>setInEditing(false)}
                        >Close</Button>
                ]}
            >
                 <UsageRecordEditor 
                    Record={selectedRecord?selectedRecord:undefined}
                    OnSubmit={OnEditorSubmitEditedRecordAsync}
                    />
            </Modal>

            <Button type='primary' disabled={selectedRecord?false:true}
                onClick={()=>{setInEditing(true)}}>
                    Edit</Button>
            <Button  type='primary' disabled={selectedRecord?false:true}
                onClick={()=>{if(selectedRecord){
                    UsageRecordLocalCacheService.Instance.SetCache(selectedRecord);
                    window.alert(`Usage record of ${selectedRecord.TestNo} is copied`);
                }}}
                style={{marginLeft:'4px',backgroundColor:selectedRecord?'green':undefined}}>
                    Copy</Button>
             <Button type="primary" danger disabled={selectedRecord?false:true}
                onClick={OnDeleteConfirmAsync}
                style={{marginLeft:'4px'}}>
                Delele
            </Button>
        </Fragment>
    )


    async function FetchUsageRecords()
    {
        const usageRecords = await _usageRecordsWebAPI.GetAsync();
        setUsageRecords([...usageRecords]);
        setCurrentPageIndex(GetPageCount(usageRecords.length,_pageSize));
        setTableLoading(false);
    }

    async function OnEditorSubmitEditedRecordAsync(editedRecord:UsageRecord)
    {
        setInEditing(false);
        editedRecord.Id = selectedRecord!.Id;
        await _usageRecordsWebAPI.PutAsync(editedRecord);
        const index = usageRecords.findIndex(record=>record.Id===selectedRecord!.Id) ;
        usageRecords[index]=editedRecord;
        setUsageRecords([...usageRecords]);
        setSelectedRecord(null);
    }

    async function OnDeleteConfirmAsync() {
        if(selectedRecord && selectedRecord.Id){
            if( window.confirm(`Sure to delete ${selectedRecord.TestNo} ?`) )
            {
                await _usageRecordsWebAPI.DeleteByIdAsync(selectedRecord.Id);
                setUsageRecords([...usageRecords.filter(item=>item.Id!==selectedRecord.Id)]);
            }
        }
    }
}


function GetPageCount(num: number, pageSize: number)
{
    return num % pageSize === 0 ? Math.floor(num / pageSize) : Math.ceil(num / pageSize);
}

function GetAndRenderDuration(usageRecord: UsageRecord)
{
    const duration = UsageRecord.GetDuration(usageRecord);
    return Number.isInteger(duration) ? duration : duration.toFixed(2);
}

function GenerateFilterOptions<TOption>(optionValues: TOption[])
{
    return (distinct(optionValues) as TOption[]).sort().map(optionValue => { return { text: optionValue, value: optionValue } });
}