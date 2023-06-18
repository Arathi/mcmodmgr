interface IUser {
    id: string;
    role: string;
    username: string;
    name: string;
}

export interface ITeamMember {
    team_id: string;
    user: IUser;
    role: string;
    permissions: number;
    accepted: boolean;
    payouts_split: number;
    ordering: number;
}

export class TeamMember {
    teamId: string;
    user: IUser;
    role: string;
    permissions: number;
    accepted: boolean;
    payoutsSplit: number;
    ordering: number;

    constructor(options: ITeamMember) {
        this.teamId = options.team_id;
        this.user = options.user;
        this.role = options.role;
        this.permissions = options.permissions;
        this.accepted = options.accepted;
        this.payoutsSplit = options.payouts_split;
        this.ordering = options.ordering;
    }
}