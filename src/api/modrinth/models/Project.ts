import {sprintf} from 'sprintf-js';

export interface ISearchResult {
    // 
}

type EnvironmentSupportValues = "required" | "optional" | "unsupported";

export interface IProject {
    slug: string;
    title: string;
    description: string;
    categories: string[];
    client_side: EnvironmentSupportValues;
    server_side: EnvironmentSupportValues;
    downloads: number;
    icon_url: string | null;
    color: number | null;
    id: string;
    team: string;
    versions: string[];
    game_versions: string[];
}

enum EnvironmentSupport {
    required,
    optional,
    unsupported
}

function toRGB(color: number | null) {
    if (color == null) return '#FFFFFF';
    return sprintf("#%06X", color);
}

export default class Project {
    slug: string;
    title: string;
    description: string;
    clientSide: EnvironmentSupport;
    serverSide: EnvironmentSupport;
    downloads: number;
    iconUrl: string | null;
    color: string | null;
    id: string;
    team: string;
    versionIdList: string[];
    gameVersions: string[];
    
    constructor(options: IProject) {
        this.slug = options.slug;
        this.title = options.title;
        this.description = options.description;
        this.clientSide = EnvironmentSupport[options.client_side];
        this.serverSide = EnvironmentSupport[options.server_side];
        this.downloads = options.downloads;
        this.iconUrl = options.icon_url;
        this.color = toRGB(options.color);
        this.id = options.id;
        this.team = options.team;
        this.versionIdList = options.versions;
        this.gameVersions = options.game_versions;
    }
}
