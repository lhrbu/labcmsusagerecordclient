import React, { Fragment, useEffect, useState } from 'react';
import { Button, Form, Input, Typography, Collapse } from 'antd';
import Project from '../Models/Project';
import ProjectsWebAPI from '../WebAPIs/ProjectsWebAPI';
import EquipmentHourlysRatesWebAPI from '../WebAPIs/EquipmentHourlyRatesWebAPI';
import EquipmentHourlyRate from '../Models/EquipmentHourlyRate';
import EquipmentHourlyRatesRepository from '../Repositories/EquipmentHourlyRatesRepository';
import ProjectsRepository from '../Repositories/ProjectsRepository';

const { Panel } = Collapse;

export default function Admin()
{
    const [inProjectSubmit,setInProjectSubmit] = useState<boolean>(false);
    const [inProjectDelete,setInProjectDelete] = useState<boolean>(false);
    const [inEquipmentHourlyRateSubmit,setInEquipmentHourlyRateSubmit]= useState<boolean>(false);
    const [inEquipmentHourlyRateDelete,setInEquipmentHourlyRateDelete]= useState<boolean>(false);
    return (
    <Fragment>
        <Collapse accordion>
                <Panel header="Add or update Project" key="AddProject">
                    <Form
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 12 }}
                        onFinish={ProjectSubmitAsync}
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
                            name="Name"
                            rules={[{ required: true, message: 'Please input project name!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Project Name in Fin."
                            name="NameInFIN"
                            rules={[{ required: true, message: 'Please input project name in FIN.!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{ offset: 8, span: 16 }}
                        >
                            <Button type="primary" htmlType="submit"
                                loading={inProjectSubmit}>Submit</Button>
                        </Form.Item>
                    </Form>
                </Panel>

                <Panel header="Delete Project" key="DeleteProject">
                    <Form
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 12 }}
                        onFinish={ProjectDeleteAsync}>
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
                            <Button type="primary" danger htmlType="submit"
                                loading={inProjectDelete}>Delete</Button>
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
                            <Button type="primary" htmlType="submit"
                                loading={inEquipmentHourlyRateSubmit}>Submit</Button>
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
                            <Button type="primary" danger htmlType="submit"
                                loading={inEquipmentHourlyRateDelete}>Delete</Button>
                        </Form.Item>

                   </Form>
                </Panel>
            </Collapse>

    </Fragment>);

    async function ProjectSubmitAsync(values: any) {
        setInProjectSubmit(true);
        try {
            const projectsWebAPI = new ProjectsWebAPI();
            const project: Project = Object.assign(new Project(), values);
            const projects = ProjectsRepository.Instance.Projects;
            if (!projects.some(item => item.No === project.No)) {
                await projectsWebAPI.PostAsync(project);
                window.alert("Add project successfully!");
            } else {
                await projectsWebAPI.PutAsync(project);
                window.alert("Update project successfully!");
            }
        } finally { 
            await ProjectsRepository.Instance.LoadAsync();
            setInProjectSubmit(false); 
        }
    }

    async function ProjectDeleteAsync(values:any){
        setInProjectDelete(true);
        try {
            const projectsWebAPI = new ProjectsWebAPI();
            await projectsWebAPI.DeleteByNameAsync(values.Name);
            window.alert("Delete project successfully!");
        } catch (error) { window.alert(error) }
        finally { 
            await ProjectsRepository.Instance.LoadAsync();
            setInProjectDelete(false); 
        }
    }

    async function OnEquipmentHourlyRateSubmitAsync(values:any)
    {
        setInEquipmentHourlyRateSubmit(true);
        try {
            const equipmentHourlyRatesWebAPI = new EquipmentHourlysRatesWebAPI();
            const equipmentHourlyRate: EquipmentHourlyRate =
                Object.assign(new EquipmentHourlyRate(), values);
            const equipmentHourlyRates = EquipmentHourlyRatesRepository.Instance.EquipmentHourlyRates;
            if (!equipmentHourlyRates.some(item => item.EquipmentNo === equipmentHourlyRate.EquipmentNo)) {
                await equipmentHourlyRatesWebAPI.PostAsync(equipmentHourlyRate);
                window.alert("Add equipment no hourly rate successfully!");
            } else {
                await equipmentHourlyRatesWebAPI.PutAsync(equipmentHourlyRate);
                window.alert("Update equipment no hourly rate successfully!");
            }
        } finally {
            await EquipmentHourlyRatesRepository.Instance.LoadAsync();
            setInEquipmentHourlyRateSubmit(false);
        }
    }

    async function OnEquipmentHourlyRateDeleteAsync(values:any)
    {
        setInEquipmentHourlyRateDelete(true);
        try {
            const equipmentHourlyRatesWebAPI = new EquipmentHourlysRatesWebAPI();
            const res = await equipmentHourlyRatesWebAPI.DeleteByNoAsync(values.No);
            window.alert("Delete equipment no hourly rate successfully!");
        } catch (error) { window.alert(error) }
        finally {
            await EquipmentHourlyRatesRepository.Instance.LoadAsync();
            setInEquipmentHourlyRateDelete(false);
        }
    }
}