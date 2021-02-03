import React, { useRef, useState } from 'react';
import { Layout, Menu } from 'antd';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import
  {
    HomeFilled, PlusCircleFilled, ProfileFilled,
    LoginOutlined, CodeFilled, SaveFilled, DatabaseFilled, BarChartOutlined
  } from '@ant-design/icons';
import './App.css';
import Home from './Pages/Home';
import AddRecord from './Pages/AddRecord';
import Records from './Pages/Records';
import Admin from './Pages/Admin';
import DynamicQuery from './Pages/DynamicQuery';
import AddMachineDownRecord from './Pages/AddMachineDownRecord';
import MachineDownRecords from './Pages/MachineDownRecords';

const { Header, Content, Footer } = Layout;


export default function App()
{

  return (
    <Layout className="layout">
      <BrowserRouter>
        <Header>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[window.location.pathname]} style={{ fontSize: '16px' }}>
            <Menu.Item key="/"><Link to='/'><HomeFilled />Home</Link></Menu.Item>
            <Menu.Item key="/AddRecord"><Link to='/AddRecord'><PlusCircleFilled />Add Record</Link></Menu.Item>
            <Menu.Item key="/Records"><Link to='/Records'><ProfileFilled />Records</Link></Menu.Item>
            <Menu.Item key="/api/ExcelExport"><a href='/api/ExcelExport' target="_blank"><SaveFilled />Excel</a></Menu.Item>
            <Menu.Item key='/AddMachineDownRecord'><Link to='/AddMachineDownRecord'><PlusCircleFilled />Add Machine Down</Link></Menu.Item>
            <Menu.Item key='/MachineDownRecords'><Link to='/MachineDownRecords'><ProfileFilled />Machine Down Records</Link></Menu.Item>
            <Menu.Item key="/DynamicQuery"><Link to='/DynamicQuery'><CodeFilled />Query</Link></Menu.Item>
            <Menu.Item key="/Admin" ><Link id='AdminMenuDom' to="/Admin"><DatabaseFilled />Admin</Link></Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 28px' }}>
          <div className="site-layout-content">
            <Switch>
              <Route exact path='/AddRecord'>
                <div style={{ padding: '2rem 10rem 0rem 10rem' }}>
                  <AddRecord />
                </div>
              </Route>
              <Route exact path='/Records'>
                <Records />
              </Route>
              <Route exact path='/AddMachineDownRecord'>
                <AddMachineDownRecord />
              </Route>
              <Route exact path='/MachineDownRecords'>
                <MachineDownRecords />
              </Route>
              <Route exact path='/DynamicQuery'>
                <DynamicQuery />
              </Route>
              <Route exact path='/Admin'>
                <Admin />
              </Route>
              <Route path='/'>
                <Home />
              </Route>
            </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>LabCMS.EquipmentDomain ©2020 Created by Raccoon Li</Footer>
      </BrowserRouter>
    </Layout>
  );
}
