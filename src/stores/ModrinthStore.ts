import { defineStore } from "pinia";
import { TeamMember } from '../api/modrinth/models/Teams';
import { Loader, GameVersion, Category } from "../api/modrinth/models/Tags";

export interface ModrinthStoreState {
    teams: Map<string, TeamMember[]>;
    categories: Category[];
    loaders: Loader[];
    gameVersions: GameVersion[];
    checkedCategories: string[];
    checkedLoaders: string[];
    checkedGameVersions: string[];
}

export const useModrinthStore = defineStore('modrinth', {
    state: (): ModrinthStoreState => ({
        teams: new Map<string, TeamMember[]>(),
        categories: [],
        loaders: [],
        gameVersions: [],
        checkedCategories: [],
        checkedLoaders: [],
        checkedGameVersions: [],
    }),
    getters: {
        ownerNames(state) : Map<string, string> {
            let names = new Map<string, string>();
            state.teams.forEach((members, teamId) => {
                let owners = members.filter((member) => member.role == 'Owner');
                if (owners.length > 0) {
                    let name = owners[0].user.username;
                    names.set(teamId, name);
                }
            });
            return names;
        }
    },
    actions: {
        addTeam(teamId: string, members: TeamMember[]) {
            this.teams.set(teamId, members);
        },
        // setCategories(categories: Category[]) {
        //     this.categories = categories;
        // },
        // setLoaders(loaders: Loader[]) {
        //     this.loaders = loaders;
        // },
        // setGameVersions(versions: GameVersion[]) {
        //     this.gameVersions = versions;
        // }
    }
});