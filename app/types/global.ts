import { Request } from 'express';

export interface RequestType<Body = any, Query = any> extends Request {
    body: Body;
    query: Query;
}

export interface ErrorType {
    message: string;
}

export interface MutationType {
    status: boolean;
    error?: string[];
}
