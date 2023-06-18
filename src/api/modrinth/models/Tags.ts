import dayjs, {Dayjs} from 'dayjs';

// region Category
export interface ICategory {
    icon: string;
    name: string;
    project_type: string;
    header: string;
}

export class Category {
    icon: string;
    name: string;
    projectType: string;
    header: string;

    constructor(options: ICategory) {
        this.icon = options.icon;
        this.name = options.name;
        this.projectType = options.project_type;
        this.header = options.header;
    }

    get project_type(): string {
        return this.projectType;
    }
}
// endregion

// region Loader
export interface ILoader {
    icon: string;
    name: string;
    supported_project_types: string[];
}

export class Loader {
    icon: string;
    name: string;
    supported_project_types: string[];
    
    supportedProjectTypes: Set<string>;

    constructor(options: ILoader) {
        this.icon = options.icon;
        this.name = options.name;
        this.supported_project_types = options.supported_project_types;
        this.supportedProjectTypes = new Set(this.supported_project_types);
    }
}
// endregion

// region Game Version
type VersionTypeValues = "release" | "snapshot" | "alpha" | "beta";

export interface IGameVersion {
    version: string;
    version_type: VersionTypeValues;
    date: string;
    major: boolean;
}

enum VersionType {
    release,
    snapshot,
    alpha,
    beta
}

export class GameVersion {
    version: string;
    versionType: VersionType;
    date: Dayjs;
    major: boolean;

    constructor(options: IGameVersion) {
        this.version = options.version;
        this.versionType = VersionType[options.version_type];
        this.date = dayjs(options.date);
        this.major = options.major;
    }
}
// endregion
