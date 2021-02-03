import React, { Fragment, useEffect, useState } from 'react';
import { Form, Input, Select, Button } from 'antd';
import EquipmentHourlyRatesRepository from '../Repositories/EquipmentHourlyRatesRepository';
import MachineDownRecord from '../Models/MachineDownRecord';
import TimeStampStringConverter from '../Services/TimeStampConverter';
import MachineDownRecordsWebAPI from '../WebAPIs/MachineDownRecordsWebAPI';
import moment from 'moment';
import UsersRepository from '../Repositories/UsersRepository';

const { Option } = Select;
const _timeStampConverter = new TimeStampStringConverter();
const _equipmentHourlyRatesRepo = EquipmentHourlyRatesRepository.Instance;
const _usersRepo = UsersRepository.Instance;
const _machineDownRecordsWebAPI = new MachineDownRecordsWebAPI();
export default function AddMachineDownRecord()
{
    const [form] = Form.useForm();
    const [submitButtonLoading, setSubmitButtonLoading] = useState<boolean>(false);
    useEffect(() =>
    {
        form.setFieldsValue({
            MachineDownDateString: _timeStampConverter.FromUnixTimeSeconds(moment().unix())
        });
    }, []);

    return (
        <Fragment>
            <Form
                form={form}
                style = {{marginTop:'2rem'}}
                labelCol={{ span: '8' }}
                wrapperCol={{ span: '12' }}
                layout="horizontal">
                <Form.Item
                    name="UserId"
                    label="User Id"
                    rules={[{ 
                        required: true,
                        validator: (_, value: string) => _usersRepo.ContainsId(value) ? Promise.resolve() : Promise.reject("User Id is invalid."),
                    }]}
                >
                    <Select showSearch
                        onSearch = {value=>form.setFieldsValue({UserId:value})}>
                        {
                            _usersRepo.Users.map(item=>
                                <Option value={item.UserId!} key={item.UserId!}>{item.UserId}</Option>)
                        }
                    </Select>
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
                                .map(item => (
                                    <Option value={item.EquipmentNo!} key={item.EquipmentNo!}>{item.EquipmentNo}</Option>
                                ))
                        }
                    </Select>
                </Form.Item>


                <Form.Item
                    name="MachineDownDateString"
                    label="Machine Down Date"
                    rules={[{ required: true, pattern: /^\d{4}\/\d{1,2}\/\d{1,2}\s\d{1,2}:\d{1,2}$/, message: 'Time format does not match yyyy/MM/dd HH:mm' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="Comment"
                    label="Comment"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit" onClick={SubmitAsync}
                        loading={submitButtonLoading}
                        style={{ marginRight: "4px" }}>
                        Submit
                    </Button>
                    <Button danger type="primary" onClick={ResetForm}>
                        Clear
               </Button>
                </Form.Item>
            </Form>
        </Fragment>
    )

    async function SubmitAsync()
    {
        setSubmitButtonLoading(true);
        try
        {
            const values = await form.validateFields();
            const machineDownRecord: MachineDownRecord = Object.assign(new MachineDownRecord(), values);
            machineDownRecord.MachineDownDate = _timeStampConverter.ToUnixTimeSeconds(values.MachineDownDateString)
            await _machineDownRecordsWebAPI.PostAsync(machineDownRecord);
            window.alert('Machine Down Record Added Successfully, Check confirmed email later!')
        }catch(err)
        {
            window.alert(err);
        } 
        finally
        {
            setSubmitButtonLoading(false);
        }
    }

    function ResetForm()
    {
        if (window.confirm('Confirm to clear all the fields?'))
        {
            form.resetFields();
            form.setFieldsValue({
                MachineDownDateString: _timeStampConverter.FromUnixTimeSeconds(moment().unix())
            });
        }
    }
}