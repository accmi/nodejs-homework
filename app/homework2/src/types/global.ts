import { Request } from 'express';

export interface RequestType<Body = any, Query = any> extends Request {
    body: Body;
    query: Query;
}

export enum UserRoutes {
    create = '/user/create',
    update = '/user/update',
    delete = '/user/delete',
    getUser = '/user/get',
    getUsers = '/users/get',
}
