import Project from "../Models/Project";
import ProjectsWebAPI from "../WebAPIs/ProjectsWebAPI";

export default class ProjectsRepository
{
    private static _instance:ProjectsRepository = new ProjectsRepository();
    private constructor(){}
    public static get Instance(){ return this._instance;}
    public async LoadAsync()
    {
        const webAPI = new ProjectsWebAPI()
        this._projects = await webAPI.GetAsync();
    }

    private _projects:Project[] = [];
    public get Projects(){return this._projects;}

    public ContainsName(projectName:string)
    {
        return this.Projects.some(item=>item.Name===projectName);
    }

    public ContainsNo(projectNo:string)
    {
        return this.Projects.some(item=>item.No===projectNo);
    }

    public FindProjectNoByName(projectName:string)
    {
        return this.Projects.find(item=>item.Name===projectName)?.No;
    }

    public FindNameByProjectNo(projectNo:string)
    {
        return this.Projects.find(item=>item.No===projectNo)?.Name;
    }
}