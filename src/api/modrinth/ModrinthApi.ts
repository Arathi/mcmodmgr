import Axios, {AxiosInstance} from 'axios';

import Project, { IProject, ISearchResult } from './models/Project';
import { ICategory, ILoader, IGameVersion, Category, Loader, GameVersion } from './models/Tags';
import {ITeamMember, TeamMember} from './models/Teams';
import Version, { IVersion } from './models/Version';

export default class ModrinthApi {
    apiBase: string;
    apiVersion: string;
    timeout: number;

    axios: AxiosInstance;

    constructor(
        apiBase: string = "https://api.modrinth.com", 
        apiVersion: string = "v2", 
        timeout: number = 3000
    ) {
        this.apiBase = apiBase;
        this.apiVersion = apiVersion;
        this.timeout = timeout;

        this.axios = Axios.create({
            baseURL: this.baseUrl,
            timeout: this.timeout,
            headers: {
                // TODO 从package.json中读取
                // 'User-Agent': 'Arathi/mcmodmgr/0.1.0 (undsf.com)'
            }
        });
    }

    get baseUrl() {
        return `${this.apiBase}/${this.apiVersion}`;
    }

    // region Projects 工程
    /**
     * 搜索工程
     * @returns 
     */
    async search() : Promise<ISearchResult|null> {
        return null;
    }

    /**
     * 根据id或者slug搜索工程
     * @param id 
     */
    async getProject(id: string) : Promise<Project|null> {
        let url = `/project/${id}`;
        let resp = await this.axios.get(url);
        if (resp.status == 200) {
            let opts = resp.data as IProject;
            let project = new Project(opts);
            return project;
        }
        return null;
    }
    // endregion

    // region Versions （工程）版本
    /**
     * 获取工程下的版本
     * @param projectId 
     * @param loaders 
     * @param gameVersions 
     * @param featured 
     * @returns 
     */
    async getProjectVersionList(
        projectId: string,
        loaders: string[] | null = null,
        gameVersions: string[] | null = null,
        featured: boolean | null = null
    ) : Promise<Version[]> {
        let url = `/project/${projectId}/version`;
        let params: any = {};
        if (loaders != null) params["loaders"] = JSON.stringify(loaders);
        if (gameVersions != null) params["game_versions"] = JSON.stringify(gameVersions);
        if (featured != null) params["featured"] = featured;
        let resp = await this.axios.get(url, {
            params: params
        });
        if (resp.status == 200) {
            let respData = resp.data as IVersion[];
            let versions = respData.map((opts) => {
                let version = new Version(opts);
                return version;
            });
            return versions;
        }
        return [];
    }

    /**
     * 获取指定版本
     * @param id 
     * @returns 
     */
    async getVersion(id: string) : Promise<Version|null> {
        let url = `/version/${id}`;
        let resp = await this.axios.get(url);
        if (resp.status == 200) {
            let respData = resp.data as IVersion;
            return new Version(respData);
        }
        return null;
    }
    // endregion

    // region Teams 团队
    /**
     * 根据工程id/slug获取开发团队成员名单
     */
    async getProjectMembers(projectId: string) : Promise<TeamMember[]> {
        let url = `/project/${projectId}/members`;
        let resp = await this.axios.get(url);
        if (resp.status == 200) {
            let respData = resp.data as ITeamMember[];
            let members: TeamMember[] = respData.map((opts) => {
                let member = new TeamMember(opts);
                return member;
            });
            return members;
        }
        return [];
    }
    // endregion

    // region Tags 标签 / 搜索条件
    /**
     * 获取分类列表
     * @returns 
     */
    async getCategories(projectType: string|null = "mod", header: string|null = "categories") : Promise<Category[]> {
        let url = `/tag/category`;
        let resp = await this.axios.get(url);
        if (resp.status == 200) {
            let respData = resp.data as ICategory[];
            let categories: Category[] = respData.filter(
                (opts) => opts.project_type == projectType && opts.header == header
            ).map((opts) => {
                let category = new Category(opts);
                return category;
            });
            return categories;
        }
        return [];
    }

    /**
     * 获取加载器列表
     * @returns 
     */
    async getLoaders(names: string[] = ["fabric", "forge"]) : Promise<Loader[]> {
        let url = `/tag/loader`;
        let resp = await this.axios.get(url);
        if (resp.status == 200) {
            let respData = resp.data as ILoader[];
            let nameSet = new Set(names);
            let loaders: Loader[] = respData.filter(
                (opts) => nameSet.has(opts.name)
            ).map((opts) => {
                let loader = new Loader(opts);
                return loader;
            });
            return loaders;
        }
        return [];
    }

    /**
     * 获取MC版本列表
     * @returns 
     */
    async getGameVersions() : Promise<GameVersion[]> {
        let url = `/tag/game_version`;
        let resp = await this.axios.get(url);
        if (resp.status == 200) {
            let respData = resp.data as IGameVersion[];
            let gameVersions: GameVersion[] = respData.map((opts) => {
                let gameVersion = new GameVersion(opts);
                return gameVersion;
            });
            return gameVersions;
        }
        return [];
    }
    // endregion
}