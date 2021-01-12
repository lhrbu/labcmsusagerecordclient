import React, { useEffect, useState } from 'react';
import UsageRecordEditor from '../Components/UsageRecordEditor';
import UsageRecord from '../Models/UsageRecord';
import UsageRecordLocalCacheService from '../Services/UsageRecordLocalCacheService';
import UsageRecordsWebAPI from '../WebAPIs/UsageRecordsWebAPI';

const _usageRecordsWebAPI = new UsageRecordsWebAPI();
export default function AddRecord()
{

    const [record,setRecord] = useState<UsageRecord | undefined>(undefined);

        useEffect(()=>{
            if(UsageRecordLocalCacheService.Instance.HasCache())
            {
                const archivedRecord = UsageRecordLocalCacheService.Instance.MoveCache()!;
                archivedRecord.Id = 0;
                setRecord(archivedRecord);
            }
        },[]);

    return <UsageRecordEditor Record={record} OnSubmit={OnSubmitNewRecordAsync}/>

    async function OnSubmitNewRecordAsync(usageRecord:UsageRecord)
    {
        await _usageRecordsWebAPI.PostAsync(usageRecord);
        window.alert(`New usage record of ${usageRecord.TestNo} is added.`);
    }
}