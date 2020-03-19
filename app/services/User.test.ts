import { UserTypes } from './../types/user';
import {
    loginUser,
    createUser,
    getToken,
    updateUser,
    deleteUser,
    getUserById,
    getUsers,
} from '.';
import { Op } from 'sequelize';

import UserType = UserTypes.UserType;
import ErrorsMessage = UserTypes.ErrorsMessage;

interface FindOrCreateOptionsType {
    where: {
        id?: string;
        login?: string;
        password?: string;
    };
    defaults: {
        password: string;
        age: number;
    }; 
}

interface UpdateUserOptionsType {
    where: {
        id: string;
    }
}

interface FindAllUsersOptionsType {
    where: {
        login: {
            [Op.like]: string;
        }
    }
}

jest.mock('../models/User', () => ({
    UserModel: {
        findOrCreate: ({ where: { login }, defaults: { password, age } }: FindOrCreateOptionsType) => {
            if (login === 'error') {
                return Promise.reject(new Error('Error case'));
            }

            return Promise.resolve([
                {
                    id: 'fb9eb808-6904-11ea-bc55-0242ac130003',
                    login,
                    password,
                    age,
                    isDeleted: false,
                },
                login !== 'admin',
            ])
        },
        findOne: ({ where: { login, password, id } }: FindOrCreateOptionsType) => {
            if (id === 'find') {
                return Promise.resolve({
                    id: 'fb9eb808-6904-11ea-bc55-0242ac130003',
                    login: 'admin',
                    password: 'we43dkkk',
                    age: 18,
                    isDeleted: false,
                });
            }

            if (id === 'noExist') {
                return Promise.resolve(undefined);
            }

            if (id === 'error') {
                return Promise.reject(new Error('Error case'));
            }

            if (login === 'error') {
                return Promise.reject(new Error('Error case'));
            }

            return Promise.resolve(
                login === 'admin' && password === 'we43dkkk' ?
                {
                    id: 'fb9eb808-6904-11ea-bc55-0242ac130003',
                    login,
                    password,
                    age: 18,
                    isDeleted: false,
                }
                :
                undefined
            )
        },
        update: ({ login, password }: UserType, { where: { id } }: UpdateUserOptionsType) => {
            if (id === 'delete') {
                return Promise.resolve([1]);
            }

            if (id === 'noExist') {
                return Promise.resolve([0]);
            }

            if (id === 'error') {
                return Promise.reject(new Error('Error case'));
            }

            if (login === 'error') {
                return Promise.reject(new Error('Error case'));
            }

            return Promise.resolve(
                login === 'admin' && password === 'we43dkkk' ?
                [1]
                : [0]
            )
        },
        findAll: ({ where: { login } }: FindAllUsersOptionsType) => {
            if (login[Op.like] === '%find%') {
                return Promise.resolve([{
                    id: 'fb9eb808-6904-11ea-bc55-0242ac130003',
                    login: 'admin',
                    password: 'we43dkkk',
                    age: 18,
                    isDeleted: false,
                }]);
            }

            if (login[Op.like] === '%unknown%') {
                return Promise.resolve(undefined);
            }

            return Promise.reject(new Error('Error case'));
        }
    },
}));

jest.mock('./Authentication', () => ({
    Authentication: {
        getPairAndSetRefreshToken: (login: string) => ({
            token: 'token',
            refreshToken: 'refreshToken',
        }),
        checkRefreshToken: (token: string, login: string) => (
            token === 'refreshToken' && login === 'admin'
        ),
        getToken: (login: string) => (
            'newToken'
        ),
    },
}));

describe('User CRUD operations', () => {
    describe('getToken function', () => {
        it('It should respond correct error with unexisting token', async() => {
            const user: UserType = {
                login: 'admin',
                password: 'we43dkkk',
            };
            const refreshToken = 'refreshToken123';

            const result = await getToken(user, refreshToken);

            expect(result).toEqual({
                status: false,
                error: [ErrorsMessage.unauthorized],
            });
        });

        it('It should respond correct token', async() => {
            const user: UserType = {
                login: 'admin',
                password: 'we43dkkk',
            };
            const refreshToken = 'refreshToken';

            const result = await getToken(user, refreshToken);

            expect(result).toEqual({
                status: true,
                tokens: {
                    token: 'newToken',
                }
            });
        });

        it('It should respond correct error when user does not have login', async() => {
            const user: UserType = {
                password: 'we43dkkk',
            };
            const refreshToken = 'refreshToken';

            const result = await getToken(user, refreshToken);

            expect(result).toEqual({
                status: false,
                error: [ErrorsMessage.uncknownError],
            });
        });
    });

    describe('loginUser function', () => {
        it('It should respond correct error with unexisting user', async() => {
            const user: UserType = {
                login: 'igor',
                password: 'we43dkkk',
            };

            const result = await loginUser(user);

            expect(result).toEqual({
                status: false,
                error: [ErrorsMessage.notFound],
            });
        });

        it('It should respond correct tokens', async() => {
            const user: UserType = {
                login: 'admin',
                password: 'we43dkkk',
            };

            const result = await loginUser(user);

            expect(result).toEqual({
                status: true,
                tokens: {
                    token: 'token',
                    refreshToken: 'refreshToken',
                },
            });
        });

        it('It should respond correct error with sequilize error', async() => {
            const user: UserType = {
                login: 'error',
                password: 'we43dkkk',
            };

            const result = await loginUser(user);

            expect(result).toEqual({
                status: false,
                error: new Error('Error case'),
            });
        });

        it('It should respond correct error when user does not have login and password', async() => {
            const user: UserType = {};
            const result = await loginUser(user);

            expect(result).toEqual({
                status: false,
                error: [ErrorsMessage.uncknownError],
            });
        });
    });

    describe('createUser function', () => {
        it('It should respond correctly with existing user', async() => {
            const user: UserType = {
                login: 'admin',
                password: 'we43dkkk',
                age: 18,
            };
            const result = await createUser(user);
    
            expect(result).toEqual({
                status: false,
                error: [ErrorsMessage.isExist],
            });
        });

        it('It should respond correctly with new user', async() => {
            const user: UserType = {
                login: 'ignat',
                password: 'we43dkkk',
                age: 18,
            };
            const result = await createUser(user);
    
            expect(result).toEqual({
                status: true,
            });
        });

        it('It should respond correct error when user does not have login, password and age', async() => {
            const user: UserType = {};
            const result = await createUser(user);

            expect(result).toEqual({
                status: false,
                error: [ErrorsMessage.uncknownError],
            });
        });

        it('It should respond correct error with sequilize error', async() => {
            const user: UserType = {
                login: 'error',
                password: 'we43dkkk',
                age: 18,
            };

            const result = await createUser(user);

            expect(result).toEqual({
                status: false,
                error: new Error('Error case'),
            });
        });
    });

    describe('updateUser function', () => {
        it('It should respond correctly with existing user', async() => {
            const user: UserType = {
                id: 'fb9eb808-6904-11ea-bc55-0242ac130003',
                login: 'admin',
                password: 'we43dkkk',
                age: 18,
            };
            const result = await updateUser(user);
    
            expect(result).toEqual({
                status: true,
            });
        });

        it('It should respond correctly with unexisting user', async() => {
            const user: UserType = {
                id: 'fb9eb808-6904-11ea-bc55-0242ac130003',
                login: 'igor',
                password: 'we43dkkk',
                age: 18,
            };

            const result = await updateUser(user);
    
            expect(result).toEqual({
                status: false,
                error: [ErrorsMessage.notFound],
            });
        });

        it('It should respond correct error when user does not have login, password and age', async() => {
            const user: UserType = {};
            const result = await updateUser(user);

            expect(result).toEqual({
                status: false,
                error: [ErrorsMessage.uncknownError],
            });
        });

        it('It should respond correct error with sequilize error', async() => {
            const user: UserType = {
                id: 'fb9eb808-6904-11ea-bc55-0242ac130003',
                login: 'error',
                password: 'we43dkkk',
                age: 18,
            };

            const result = await updateUser(user);

            expect(result).toEqual({
                status: false,
                error: new Error('Error case'),
            });
        });
    });

    describe('deleteUser function', () => {
        it('It should respond correctly with existing user', async() => {
            const id: string = 'delete';
            const result = await deleteUser(id);
    
            expect(result).toEqual({
                status: true,
            });
        });

        it('It should respond correctly with unexisting user', async() => {
            const id: string = 'noExist';

            const result = await deleteUser(id);
    
            expect(result).toEqual({
                status: false,
                error: [ErrorsMessage.notFound],
            });
        });

        it('It should respond correct error with sequilize error', async() => {
            const id: string = 'error';

            const result = await deleteUser(id);

            expect(result).toEqual({
                status: false,
                error: new Error('Error case'),
            });
        });
    });

    describe('getUserById function', () => {
        it('It should respond correctly with existing user', async() => {
            const id: string = 'find';
            const result = await getUserById(id);
    
            expect(result).toEqual({
                status: true,
                user: {
                    id: 'fb9eb808-6904-11ea-bc55-0242ac130003',
                    login: 'admin',
                    password: 'we43dkkk',
                    age: 18,
                    isDeleted: false,
                }
            });
        });

        it('It should respond correctly with unexisting user', async() => {
            const id: string = 'noExist';

            const result = await getUserById(id);
    
            expect(result).toEqual({
                status: false,
                error: [ErrorsMessage.notFound],
            });
        });

        it('It should respond correct error with sequilize error', async() => {
            const id: string = 'error';

            const result = await getUserById(id);

            expect(result).toEqual({
                status: false,
                error: new Error('Error case'),
            });
        });
    });

    describe('getUsers function', () => {
        it('It should respond users correctly', async() => {
            const loginSubstring: string = 'find';

            const result = await getUsers(loginSubstring, '0');
    
            expect(result).toEqual({
                status: true,
                users: [
                    {
                        id: 'fb9eb808-6904-11ea-bc55-0242ac130003',
                        login: 'admin',
                        password: 'we43dkkk',
                        age: 18,
                        isDeleted: false,
                    }
                ]
            });
        });

        it('It should respond error correctly with incorrect users', async() => {
            const loginSubstring: string = 'unknown';

            const result = await getUsers(loginSubstring, '0');
    
            expect(result).toEqual({
                status: false,
                error: [ErrorsMessage.uncknownError],
            });
        });

        it('It should respond correct error with sequilize error', async() => {
            const loginSubstring: string = 'error';

            const result = await getUsers(loginSubstring, '0');

            expect(result).toEqual({
                status: false,
                error: new Error('Error case'),
            });
        });
    });
});
