import React, { Fragment, useEffect, useState } from 'react';
import { Button, Form, Input, Typography, Collapse } from 'antd';
import Project from '../Models/Project';
import ProjectsWebAPI from '../WebAPIs/ProjectsWebAPI';
import EquipmentHourlysRatesWebAPI from '../WebAPIs/EquipmentHourlyRatesWebAPI';
import EquipmentHourlyRate from '../Models/EquipmentHourlyRate';

const { Panel } = Collapse;

export default function Admin()
{
    return (
    <Fragment>
        <Collapse accordion>
                <Panel header="Add or update Project" key="AddProject">
                    <Form
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 12 }}
                        onFinish={OnProjectSubmitAsync}
                    >
                        <Form.Item
                            label="Project No."
                            name="No"
                            rules={[{ required: true, message: 'Please input project No!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Project Name"
                            name="FullName"
                            rules={[{ required: true, message: 'Please input project name!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{ offset: 8, span: 16 }}
                        >
                            <Button type="primary" htmlType="submit">Submit</Button>
                        </Form.Item>
                    </Form>
                </Panel>

                <Panel header="Delete Project" key="DeleteProject">
                    <Form
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 12 }}
                        onFinish={OnProjectDeleteAsync}>
                            <Form.Item
                            label="Project Name."
                            name="Name"
                            rules={[{ required: true, message: 'Please input project Name!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{ offset: 8, span: 16 }}
                        >
                            <Button type="primary" danger htmlType="submit">Delete</Button>
                        </Form.Item>

                   </Form>
                </Panel>

                <Panel header="Add or update Equipment Hourly Rate" key="AddEquipmentHourlyRate">
                <Form
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 12 }}
                        onFinish={OnEquipmentHourlyRateSubmitAsync}
                    >
                        <Form.Item
                            label="Equipment No"
                            name="EquipmentNo"
                            rules={[{ required: true, message: 'Please input equipment no!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Equipment Name"
                            name="EquipmentName"
                            rules={[{ required: true, message: 'Please input equipment name!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Machine Category"
                            name="MachineCategory"
                            rules={[{ required: true, message: 'Please input machine category!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Hourly Rate"
                            name="HourlyRate"
                            rules={[{ required: true, message: 'Please input hourly rate!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{ offset: 8, span: 16 }}
                        >
                            <Button type="primary" htmlType="submit">Submit</Button>
                        </Form.Item>
                    </Form>
                </Panel>

                <Panel header="Delete Equipment Hourly Rate" key="DeleteEquipmentHourlyRate">
                <Form
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 12 }}
                        onFinish={OnEquipmentHourlyRateDeleteAsync}>
                            <Form.Item
                            label="Equipment No."
                            name="No"
                            rules={[{ required: true, message: 'Please input equipment No!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{ offset: 8, span: 16 }}
                        >
                            <Button type="primary" danger htmlType="submit">Delete</Button>
                        </Form.Item>

                   </Form>
                </Panel>
            </Collapse>

    </Fragment>);

    async function OnProjectSubmitAsync(values: any) {
        const project = Object.assign(new Project(), values);
        const projectsWebAPI = new ProjectsWebAPI();
        await projectsWebAPI.PostAsync(project);
    }

    async function OnProjectDeleteAsync(values:any){
        const projectsWebAPI = new ProjectsWebAPI();
        await projectsWebAPI.DeleteByNameAsync(values.Name);
    }

    async function OnEquipmentHourlyRateSubmitAsync(values:any)
    {
        const equipmentHourlyRate = Object.assign(new EquipmentHourlyRate(),values);
        const equipmentHourlyRatesWebAPI = new EquipmentHourlysRatesWebAPI();
        await equipmentHourlyRatesWebAPI.PostAsync(equipmentHourlyRate);
    }

    async function OnEquipmentHourlyRateDeleteAsync(values:any)
    {
        const equipmentHourlyRatesWebAPI = new EquipmentHourlysRatesWebAPI();
        equipmentHourlyRatesWebAPI.DeleteByNoAsync(values.No);
    }
}