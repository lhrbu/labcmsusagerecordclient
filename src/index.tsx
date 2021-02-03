import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.css';
import ProjectsRepository from './Repositories/ProjectsRepository';
import EquipmentHourlyRatesRepository from './Repositories/EquipmentHourlyRatesRepository';
import UsersRepository from './Repositories/UsersRepository';

async function Main() {
  try{
    await Promise.all([
      ProjectsRepository.Instance.LoadAsync(),
      EquipmentHourlyRatesRepository.Instance.LoadAsync(),
      UsersRepository.Instance.LoadAsync()]
      
    );
  

    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById('root')
    );

    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals();
    
  }catch(error){
    window.alert(`Can't load project or equipment hourly rate or userid information. with error: ${error}`);
  }

}

Main();
