import { MutationType } from './global';

export namespace UserGroupTypes {
    export enum UserGroupRoutes {
        common = '/usersGroup/*',
        create = '/usersGroup/create',
    }

    export enum ErrorsMessage {
        notFound = 'UsersGroup not found',
        isExist = 'UsersGroup already exist',
        wasDeleted = 'UsersGroup was deleted',
        uncknownError = 'Unknown error',
    }

    export interface AddUsersToGroupType {
        groupId: string;
        userIds: string[];
    }

    export interface MutationUserGroupType extends MutationType { }
}
