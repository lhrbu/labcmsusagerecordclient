import React from 'react';
import UsageRecordEditor from '../Components/UsageRecordEditor';
import UsageRecord from '../Models/UsageRecord';
import UsageRecordLocalCacheService from '../Services/UsageRecordLocalCacheService';
import UsageRecordsWebAPI from '../WebAPIs/UsageRecordsWebAPI';


export default function AddRecord()
{
    const _usageRecordsWebAPI = new UsageRecordsWebAPI();
    let record:UsageRecord | undefined = undefined;
    if(UsageRecordLocalCacheService.Instance.HasCache())
    {
        record = UsageRecordLocalCacheService.Instance.MoveCache()!;
        record!.Id = 0;
    }

    return <UsageRecordEditor Record={record} OnSubmit={OnSubmitNewRecordAsync}/>

    async function OnSubmitNewRecordAsync(usageRecord:UsageRecord)
    {
        await _usageRecordsWebAPI.PostAsync(usageRecord);
        window.alert(`New usage record of ${usageRecord.TestNo} is added.`);
    }
}