import { Request } from 'express';

export interface RequestType<Body = any, Query = any> extends Request {
    body: Body;
    query: Query;
}

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

export interface ErrorType {
    message: string;
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

export interface MutationUsersType {
    status: boolean;
    error?: string[];
}

export interface QueryUserType extends MutationUsersType {
    user?: UserType;
    users?: UserType[];
}

export type UserModelResultType = MutationUsersType | QueryUserType;
