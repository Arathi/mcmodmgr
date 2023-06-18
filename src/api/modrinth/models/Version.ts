type VersionTypeValue = "release" | "beta" | "alpha";
type FileTypeValue = "required-resource-pack" | "optional-resource-pack" | null;

export interface IVersion {
    name: string;
    version_number: string;
    game_versions: string[];
    version_type: VersionTypeValue;
    loaders: string[];
    featured: boolean;
    id: string;
    project_id: string;
    author_id: string;
    downloads: number;
    files: IVersionFile[];
}

export enum VersionFileType {
    required,
    optional
}

export enum VersionType {
    release,
    beta,
    alpha
}

export default class Version {
    name: string;
    versionNumber: string;
    gameVersions: string[];
    versionType: VersionType;
    loaders: string[];
    featured: boolean;
    id: string;
    projectId: string;
    authorId: string;
    downloads: number;
    files: VersionFile[];

    constructor(options: IVersion) {
        this.name = options.name;
        this.versionNumber = options.version_number;
        this.gameVersions = options.game_versions;
        this.versionType = VersionType[options.version_type];
        this.loaders = options.loaders;
        this.featured = options.featured;
        this.id = options.id;
        this.projectId = options.project_id;
        this.authorId = options.author_id;
        this.downloads = options.downloads;
        this.files = options.files.map((opts) => {
            return new VersionFile(opts);
        });
    }
}

export interface IVersionFile {
    // hashes: any;
    url: string;
    filename: string;
    primary: boolean;
    size: number;
    file_type: FileTypeValue;
}

export class VersionFile {
    url: string;
    filename: string;
    primary: boolean;
    size: number;
    fileType: VersionFileType|null;

    constructor(options: IVersionFile) {
        this.url = options.url;
        this.filename = options.filename;
        this.primary = options.primary;
        this.size = options.size;

        if (options.file_type != null) {
            if (options.file_type == "required-resource-pack") {
                this.fileType = VersionFileType.required;
            }
            else {
                this.fileType = VersionFileType.optional;
            }
        }
        else {
            this.fileType = null;
        }
    }
}
