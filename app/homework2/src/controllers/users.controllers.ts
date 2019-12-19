import { Response } from 'express';
import { RequestType } from '../types/global';
import { Users } from '../orm/users.orm';
import { UsersOrmTypes } from '../orm/user.orm.types';
import * as uuid from 'uuid';

import UserType = UsersOrmTypes.UserType;

export const createUser = (req: RequestType<UserType>, res: Response) => {
    try {
        const {
            body: {
                login,
                password,
                age,
            }
        } = req;
        const id = uuid.v1();
        const result = Users.create({
            id,
            login,
            password,
            age,
            isDeleted: false
        });
    
        res.send(result);
    } catch (error) {
        res.send(error).status(500);
    }
};

export const updateUser = (req: RequestType<UserType>, res: Response) => {
    try {
        const {
            body: {
                id,
                login,
                password,
                age,
            }
        } = req;
        const result = Users.update({
            id,
            login,
            password,
            age
        });
    
        res.send(result);
    } catch (error) {
        res.send(error).status(500);
    }
};

export const getUserById = (req: RequestType<{}, {id: string}>, res: Response) => {
    try {
        const {
            query: {
                id
            }
        } = req;
        const result = Users.getUserById(id);

        if (result) {
            res.send(result);

            return;
        }

        res.send(null);
    } catch (error) {
        res.send(error).status(500);
    }
};

export const getUsers = (req: RequestType<{}, {substring: string; limit: string}>, res: Response) => {
    try {
        const {
            query: {
                substring,
                limit,
            }
        } = req;
        res.send(Users.getUsers(substring, Number(limit)));
    } catch (error) {
        res.send(error).status(500);
    }
}

export const deleteUser = (req: RequestType<{id: string}>, res: Response) => {
    try {
        const {
            body: {
                id
            }
        } = req;
        const result = Users.delete(id);

        if (result) {
            res.send(true);

            return;
        }

        res.send(false);
    } catch (error) {
        res.send(error).status(500);
    }
};
