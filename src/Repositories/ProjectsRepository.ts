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

    public ContainsFullName(fullName:string)
    {
        return this.Projects.some(item=>item.FullName===fullName);
    }

    public FindProjectNoByFullName(fullName:string)
    {
        return this.Projects.find(item=>item.FullName===fullName)?.No;
    }

    public FindFullNameByProjectNo(projectNo:string)
    {
        return this.Projects.find(item=>item.No===projectNo)?.FullName;
    }
}