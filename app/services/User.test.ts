import { UserTypes } from './../types/user';
import {
    loginUser,
    createUser,
} from '.';

import UserType = UserTypes.UserType;
import ErrorsMessage = UserTypes.ErrorsMessage;

interface FindOrCreateOptionsType {
    where: {
        login: string;
        password?: string;
    };
    defaults: {
        password: string;
        age: number;
    }; 
}

jest.mock('../models/User', () => ({
    UserModel: {
        findOrCreate: ({ where: { login }, defaults: { password, age } }: FindOrCreateOptionsType) => Promise.resolve([
            {
                id: 'fb9eb808-6904-11ea-bc55-0242ac130003',
                login,
                password,
                age,
                isDeleted: false,
            },
            login !== 'admin',
        ]),
        findOne: ({ where: { login, password } }: FindOrCreateOptionsType) => {
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
    },
}));

jest.mock('./Authentication', () => ({
    Authentication: {
        getPairAndSetRefreshToken: (login: string) => ({
            token: 'token',
            refreshToken: 'refreshToken',
        }),
    },
}));

describe('User CRUD operations', () => {
    describe('loginUser function', () => {
        it('It should response correct error with unexisting user', async() => {
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

        it('It should response correct tokens', async() => {
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

        it('It should response correct error with sequilize error', async() => {
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
    });

    describe('createUser function', () => {
        it('It should response correctly with existing user', async() => {
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
        it('It should response correctly with new user', async() => {
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
    })
});
