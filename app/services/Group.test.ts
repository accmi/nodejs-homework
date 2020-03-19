import { GroupTypes } from './../types/group';
import {
    createGroup,
    updateGroup,
    deleteGroup,
    getGroupById,
    getGroups,
} from '.';
import { Op } from 'sequelize';

import GroupType = GroupTypes.GroupType;
import ErrorsMessage = GroupTypes.ErrorsMessage;
import GroupPermissions = GroupTypes.GroupPermissions;

interface FindOrCreateOptionsType {
    where: {
        id?: string;
        name?: string;
        permissions?: string[];
    };
    defaults: {
        name: string;
        permissions: string[];
    }; 
}

interface UpdateOptionsType {
    where: {
        id: string;
    }
}

let getGroupsErrorTrigger: string = '';

jest.mock('../models/Group', () => ({
    GroupModel: {
        findOrCreate: ({ where: { name: findName }, defaults: { name, permissions } }: FindOrCreateOptionsType) => {
            if (name === 'error') {
                return Promise.reject(new Error('Error case'));
            }

            return Promise.resolve([
                {
                    id: 'fb9eb808-6904-11ea-bc55-0242ac130003',
                    name: 'admin',
                    permissions: [GroupPermissions.READ],
                },
                name !== 'admin',
            ])
        },
        findOne: ({ where: { id } }: FindOrCreateOptionsType) => {
            if (id === 'find') {
                return Promise.resolve({
                    id: 'fb9eb808-6904-11ea-bc55-0242ac130003',
                    name: 'admin',
                    permissions: [GroupPermissions.READ],
                });
            }

            if (id === 'noExist') {
                return Promise.resolve(undefined);
            }

            return Promise.reject(new Error('Error case'));
        },
        update: ({ name, permissions }: GroupType, { where: { id } }: UpdateOptionsType) => {

            if (name === 'error') {
                return Promise.reject(new Error('Error case'));
            }

            return Promise.resolve(
                name === 'admin' ?
                [1]
                : [0]
            )
        },
        findAll: () => {
            if (getGroupsErrorTrigger === 'find') {
                return Promise.resolve([{
                    id: 'fb9eb808-6904-11ea-bc55-0242ac130003',
                    name: 'admin',
                    permissions: [GroupPermissions.READ],
                }]);
            }

            if (getGroupsErrorTrigger === 'unknown') {
                return Promise.resolve(undefined);
            }

            return Promise.reject(new Error('Error case'));
        },
        destroy: ({ where: { id } }: UpdateOptionsType) => {
            if (id === 'admin') {
                return Promise.resolve(1);
            }

            if (id === 'error') {
                return Promise.reject(new Error('Error case'));
            }

            return Promise.resolve(0);
        }
    },
}));

describe('Group CRUD operations', () => {
    describe('createGroup function', () => {
        it('It should respond correctly with existing group', async() => {
            const group: GroupType = {
                name: 'admin',
                permissions: [],
            };
            const result = await createGroup(group);
    
            expect(result).toEqual({
                status: false,
                error: [ErrorsMessage.isExist],
            });
        });

        it('It should respond correctly with new user', async() => {
            const group: GroupType = {
                name: 'manager',
                permissions: [],
            };
            const result = await createGroup(group);
    
            expect(result).toEqual({
                status: true,
            });
        });

        it('It should respond correct error when user does not have login, password and age', async() => {
            const group: GroupType = {};
            const result = await createGroup(group);

            expect(result).toEqual({
                status: false,
                error: [ErrorsMessage.uncknownError],
            });
        });

        it('It should respond correct error with sequilize error', async() => {
            const group: GroupType = {
                name: 'error',
                permissions: [],
            };
            const result = await createGroup(group);

            expect(result).toEqual({
                status: false,
                error: new Error('Error case'),
            });
        });
    });

    describe('updateGroup function', () => {
        it('It should respond correctly with existing group', async() => {
            const group: GroupType = {
                id: 'fb9eb808-6904-11ea-bc55-0242ac130003',
                name: 'admin',
                permissions: [GroupPermissions.READ],
            };
            const result = await updateGroup(group);
    
            expect(result).toEqual({
                status: true,
            });
        });

        it('It should respond correctly with unexisting group', async() => {
            const group: GroupType = {
                id: 'fb9eb808-6904-11ea-bc55-0242ac130003',
                name: 'manager',
                permissions: [],
            };

            const result = await updateGroup(group);
    
            expect(result).toEqual({
                status: false,
                error: [ErrorsMessage.notFound],
            });
        });

        it('It should respond correct error when user does not have params', async() => {
            const group: GroupType = {};
            const result = await updateGroup(group);

            expect(result).toEqual({
                status: false,
                error: [ErrorsMessage.uncknownError],
            });
        });

        it('It should respond correct error with sequilize error', async() => {
            const group: GroupType = {
                id: 'fb9eb808-6904-11ea-bc55-0242ac130003',
                name: 'error',
                permissions: [],
            };

            const result = await updateGroup(group);

            expect(result).toEqual({
                status: false,
                error: new Error('Error case'),
            });
        });
    });

    describe('deleteGroup function', () => {
        it('It should respond correctly with existing group', async() => {
            const id: string = 'admin';
            const result = await deleteGroup(id);
    
            expect(result).toEqual({
                status: true,
            });
        });

        it('It should respond correctly with unexisting group', async() => {
            const id: string = 'noExist';

            const result = await deleteGroup(id);
    
            expect(result).toEqual({
                status: false,
                error: [ErrorsMessage.notFound],
            });
        });

        it('It should respond correct error with sequilize error', async() => {
            const id: string = 'error';

            const result = await deleteGroup(id);

            expect(result).toEqual({
                status: false,
                error: new Error('Error case'),
            });
        });
    });

    describe('getGroupById function', () => {
        it('It should respond correctly with existing group', async() => {
            const id: string = 'find';
            const result = await getGroupById(id);
    
            expect(result).toEqual({
                status: true,
                group: {
                    id: 'fb9eb808-6904-11ea-bc55-0242ac130003',
                    name: 'admin',
                    permissions: [GroupPermissions.READ],
                }
            });
        });

        it('It should respond correctly with unexisting group', async() => {
            const id: string = 'noExist';

            const result = await getGroupById(id);
    
            expect(result).toEqual({
                status: false,
                error: [ErrorsMessage.notFound],
            });
        });

        it('It should respond correct error with sequilize error', async() => {
            const id: string = 'error';

            const result = await getGroupById(id);

            expect(result).toEqual({
                status: false,
                error: new Error('Error case'),
            });
        });
    });

    describe('getUsers function', () => {
        it('It should respond groups correctly', async() => {
            getGroupsErrorTrigger = 'find';

            const result = await getGroups();
    
            expect(result).toEqual({
                status: true,
                groups: [
                    {
                        id: 'fb9eb808-6904-11ea-bc55-0242ac130003',
                        name: 'admin',
                        permissions: [GroupPermissions.READ],
                    }
                ]
            });
        });

        it('It should respond error correctly with incorrect groups', async() => {
            getGroupsErrorTrigger = 'unknown';

            const result = await getGroups();
    
            expect(result).toEqual({
                status: false,
                error: [ErrorsMessage.uncknownError],
            });
        });

        it('It should respond correct error with sequilize error', async() => {
            getGroupsErrorTrigger = '';

            const result = await getGroups();

            expect(result).toEqual({
                status: false,
                error: new Error('Error case'),
            });
        });
    });
});
