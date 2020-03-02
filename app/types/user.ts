import { MutationType } from './global';
 
export namespace UserTypes {
    export enum UserRoutes {
        common = '/users/*',
        create = '/users/create',
        update = '/users/update',
        delete = '/users/delete',
        getUser = '/users/getUser',
        getUsers = '/users/getUsers',
    }
    
    export enum ErrorsMessage {
        notFound = 'User not found',
        isExist = 'User already exist',
        wasDeleted = 'User was deleted',
        uncknownError = 'Unknown error',
    }
    
    export interface UserType {
        id?: string;
        login?: string;
        password?: string;
        age?: number;
        isDeleted?: boolean;
    }
    
    export interface GetUsersType {
        loginSubstring: string;
        limit: string;
    }
    
    export interface GetUserByIdType {
        id: string;
    }
    
    export interface MutationUsersType extends MutationType { }
    
    export interface QueryUserType extends MutationUsersType {
        user?: UserType;
        users?: UserType[];
    }
}