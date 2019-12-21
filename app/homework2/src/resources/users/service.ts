import * as uuid from 'uuid';
import { UsersModel } from './model';
import { UserType } from './types';

export const createUser = (user: UserType) => {
    const { login, password, age } = user;
    const id = uuid.v1();
    return UsersModel.create({
        id,
        login,
        password,
        age,
        isDeleted: false
    });
};


export const updateUser = (user: UserType) => {
    const { id, login, password, age } = user;
    return UsersModel.update({
        id,
        login,
        password,
        age
    });
};

export const deleteUser = (id: string) => {
    return UsersModel.delete(id);
}

export const getUserById = (id: string) => {
    return UsersModel.getUserById(id);
};

export const getUsers = (loginSubstring: string, limit: string) => {
    return UsersModel.getUsers(loginSubstring, Number(limit));
};
