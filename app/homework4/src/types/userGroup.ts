import { MutationType } from './global';

export namespace UserGroupTypes {
    export enum UserGroupRoutes {
        common = '/userGroup/*',
        create = '/userGroup/create',
    }

    export enum ErrorsMessage {
        notFound = 'User not found',
        isExist = 'User already exist',
        wasDeleted = 'User was deleted',
        uncknownError = 'Unknown error',
    }

    export interface AddUsersToGroupType {
        groupId: string;
        userIds: string[];
    }

    export interface MutationUserGroupType extends MutationType { }
}
