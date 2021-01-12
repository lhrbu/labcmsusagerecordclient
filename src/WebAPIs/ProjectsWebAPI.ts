import axios from 'axios';
import Project from '../Models/Project';

export default class ProjectsWebAPI
{
    private readonly _url = '/api/Projects';
    public async GetAsync()
    {
        return (await axios.get(this._url,{params:{date:new Date()}})).data as Project[];
    }
    public async PostAsync(project:Project)
    {
        await axios.post(this._url,project,{params:{date:new Date()}});
    }
    public async PutAsync(project:Project)
    {
        await axios.put(this._url,project,{params:{date:new Date()}});
    }
    public async DeleteByNameAsync(name:string)
    {
        const nameUrl = `${this._url}/${encodeURIComponent(name)}`;
        return await axios.delete(nameUrl);
    }
}