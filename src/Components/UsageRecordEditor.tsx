import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button } from 'antd';
import UsageRecord from '../Models/UsageRecord';
import moment from 'moment';
import TimeStampStringConverter from '../Services/TimeStampConverter';
import ProjectsRepository from '../Repositories/ProjectsRepository';
import EquipmentHourlyRatesRepository from '../Repositories/EquipmentHourlyRatesRepository';

const { Option } = Select;
const _timeStampConverter = new TimeStampStringConverter();
const _projectsRepo = ProjectsRepository.Instance;
const _equipmentHourlyRatesRepo = EquipmentHourlyRatesRepository.Instance;


const UsageRecordEditor: React.FC<{
    Record?: UsageRecord,
    OnSubmit? : (record:UsageRecord) => Promise<void>
    OnCancel?:()=>Promise<void>
}> = ({ Record,OnSubmit,OnCancel }) =>
    {
        const [form] = Form.useForm();
        const [submitButtonLoading,setSubmitButtonLoading]=useState<boolean>(false);

        
        useEffect(()=>{
            if(Record)
            {
                form.setFieldsValue(Record);
                form.setFieldsValue({
                    ProjectName:_projectsRepo.FindNameByProjectNo(Record.ProjectNo!),
                    StartTimeString:_timeStampConverter.FromUnixTimeSeconds(Record.StartTime!),
                    EndTimeString:_timeStampConverter.FromUnixTimeSeconds(Record.EndTime!)
                });
            }else{
                form.setFieldsValue({
                    StartTimeString:_timeStampConverter.FromUnixTimeSeconds(moment().unix()),
                    EndTimeString:_timeStampConverter.FromUnixTimeSeconds(moment().unix())
                });
            }
        },[Record]);

        return (
            <Form
                form={form}
                labelCol={{ span: '8' }}
                wrapperCol={{ span: '16' }}
                layout="horizontal"
                initialValues={Record ?? undefined}
            >
                <Form.Item
                    name="User"
                    label="User"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="TestNo"
                    label="Test No"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="EquipmentNo"
                    label="Equipment No"
                    rules={[{
                        required: true,
                        validator: (_, value: string) => _equipmentHourlyRatesRepo.ContainsNo(value) ? Promise.resolve() : Promise.reject("Equipment no is invalid."),
                        message: "Equipment no is invalid."
                    }]}
                >
                    <Select showSearch
                        onSearch={value => form.setFieldsValue({ EquipmentNo: value })}>
                        {
                            _equipmentHourlyRatesRepo.EquipmentHourlyRates
                                .map(item=>(
                                    <Option value={item.EquipmentNo!} key={item.EquipmentNo!}>{item.EquipmentNo}</Option>
                                ))
                        }
                    </Select>
                </Form.Item>

                <Form.Item
                    name="TestType"
                    label="Test Type"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="ProjectName"
                    label="Project Name"
                    rules={[{
                        required: true,
                        validator: (_, value: string) => _projectsRepo.ContainsName(value) ? Promise.resolve() : Promise.reject("Project name is invalid."),
                        message: "Project name is invalid."
                    }]}
                >
                    <Select showSearch
                        onSelect={OnProjectNameSelected}>
                        {
                            _projectsRepo.Projects.map( item=>(
                                <Option value={item.Name!} key={item.Name!}>{item.Name}</Option>
                            ))
                        }
                    </Select>
                </Form.Item>

                <Form.Item
                    name="ProjectNo"
                    label="Project No"
                    rules={[{
                        required: true,
                        validator: (_, value: string) => _projectsRepo.ContainsNo(value) ? Promise.resolve() : Promise.reject("Project name is invalid."),
                        message: "Project no is invalid."
                    }]}
                    >
                    <Select showSearch
                        onSelect={OnProjectNoSelected}>
                        {
                            _projectsRepo.Projects.map( item=>(
                                <Option value={item.No!} key={item.No!}>{item.No}</Option>
                            ))
                        }
                    </Select>
                </Form.Item>             

                <Form.Item
                    name="StartTimeString"
                    label="Start Time"
                    rules={[{ required: true, pattern: /^\d{4}\/\d{1,2}\/\d{1,2}\s\d{1,2}:\d{1,2}$/, message: 'Time format does not match yyyy/MM/dd HH:mm' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="EndTimeString"
                    label="End Time"
                    rules={[{ required: true, pattern: /^\d{4}\/\d{1,2}\/\d{1,2}\s\d{1,2}:\d{1,2}$/, message: 'Time format does not match yyyy/MM/dd HH:mm' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit" onClick={SubmitAsync}
                        loading={submitButtonLoading}
                        style={{marginRight:"4px"}}>
                        Submit
                    </Button>
                    <Button danger type="primary" onClick={ResetForm}>
                        Clear
                    </Button>
                </Form.Item>
            </Form>
        );

        async function SubmitAsync ()
        {
            setSubmitButtonLoading(true);
            try
            {
                const values = await form.validateFields();
                const usageRecord: UsageRecord = Object.assign(new UsageRecord(), values);
                const projecrtNo = _projectsRepo.FindProjectNoByName(values.ProjectName);
                if(!projecrtNo)
                {
                    window.alert("Has problem with project no!");
                    return;
                } 
                usageRecord.ProjectNo = projecrtNo
                usageRecord.StartTime = _timeStampConverter.ToUnixTimeSeconds(values.StartTimeString);
                usageRecord.EndTime = _timeStampConverter.ToUnixTimeSeconds(values.EndTimeString);

                for (const key in usageRecord) {
                    if(key === "Id"){continue;}
                    if (Object.prototype.hasOwnProperty.call(usageRecord, key)) {
                        const wrap:any = usageRecord;
                        if(!wrap[key]){
                            if(key!=="EquipmentHourlyRate" && key!=="Project"){
                                window.alert(`${key} property with no value!`);
                            }
                        }
                    }
                }
                await OnSubmit?.(usageRecord);
            }finally{
                setSubmitButtonLoading(false);
            }
        };

        function OnProjectNameSelected(value:string)
        {
            const projectNo = _projectsRepo.FindProjectNoByName(value);
            form.setFieldsValue({
                ProjectNo:projectNo,
                ProjectName:value
            });
        }

        function OnProjectNoSelected(value:string)
        {
            const projectName = _projectsRepo.FindNameByProjectNo(value);
            form.setFieldsValue({
                ProjectNo: value,
                ProjectName: projectName
            });
        }

        function ResetForm()
        {
            if( window.confirm('Confirm to clear all the fields?'))
            {
                form.setFieldsValue(new UsageRecord());
                OnCancel?.();
            }
        }
    }

    export default UsageRecordEditor;