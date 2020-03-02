import { MutationType } from "./global";

export namespace GroupTypes {
    export enum GroupRoutes {
        common = '/groups/*',
        create = '/groups/create',
        update = '/groups/update',
        delete = '/groups/delete',
        getGroup = '/groups/getGroup',
        getGroups = '/groups/getGroups',
    }

    export enum GroupPermissions {
        READ = 'READ',
        WRITE = 'WRITE',
        DELETE = 'DELETE',
        SHARE = 'SHARE',
        UPLOAD_FILES = 'UPLOAD_FILES',
    }

    export interface GroupType {
        id?: string;
        name: string;
        permissions: GroupPermissions[];
    }

    export enum ErrorsMessage {
        notFound = 'Group not found',
        isExist = 'Group already exist',
        wasDeleted = 'Group was deleted',
        uncknownError = 'Unknown error',
    }

    export interface GetGroupByIdType {
        id: string;
    }

    export interface MutationGroupsType extends MutationType {}

    export interface QueryGroupType extends MutationGroupsType {
        group?: GroupType;
        groups?: GroupType[];
    }

    export type GroupModelResultType = MutationGroupsType | QueryGroupType;
}
