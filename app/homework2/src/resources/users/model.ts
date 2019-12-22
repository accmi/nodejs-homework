import {
    UserType,
    MutationUsersType,
    QueryUserType,
    ErrorsMessage,
} from './types';

class UsersClass {
    users: UserType[] = [];

    create(newUser: UserType): MutationUsersType {
        const isUserExist = this.users.some((user) => user.id === newUser.id);

        if (isUserExist) {
            return {
                status: false,
                error: [ErrorsMessage.isExist],
            };
        }
        
        this.users.push(newUser);

        return {
            status: true,
        };
    }

    update(user: UserType): MutationUsersType {
        const userIndex = this.users.findIndex((oldUser) => oldUser.id === user.id);

        if (userIndex >= 0) {
            const oldUser = this.users[userIndex];
            const newUser = user;
            this.users[userIndex] = {
                id: newUser.id ? newUser.id : oldUser.id,
                login: newUser.login ? newUser.login : oldUser.login,
                password: newUser.password ? newUser.password : oldUser.password,
                age: newUser.age ? newUser.age : oldUser.age,
                isDeleted: newUser.isDeleted ? newUser.isDeleted : oldUser.isDeleted,
            };

            return {
                status: true,
            };
        }

        return {
            status: false,
            error: [ErrorsMessage.notFound],
        };
    }

    delete(id: string): MutationUsersType {
        const userIndex = this.users.findIndex((user) => user.id === id);

        if (userIndex >= 0) {
            this.users[userIndex].isDeleted = true;

            return {
                status: true,
            };
        }

        return {
            status: false,
            error: [ErrorsMessage.notFound],
        };
    }

    getUserById(id: string): QueryUserType {
        const needUser = this.users.find((user) => user.id === id);

        if (needUser && !needUser.isDeleted) {
            return {
                status: true,
                user: needUser,
            };
        }

        return {
            status: false,
            error: needUser && needUser.isDeleted ? [ErrorsMessage.wasDeleted] : [ErrorsMessage.notFound],
        };
    }

    getUsers(loginSubstring: string, limit: number): QueryUserType {
        const users = this.users
            .filter((user, index) => (
                user.login
                && !user.isDeleted
                && user.login.search(loginSubstring) >= 0
                && index < limit
            ))
            .sort((a, b) => a.login && b.login ? a.login.localeCompare(b.login) : -1);

        return {
            status: true,
            users,
        };
    }
}

export const UsersModel = new UsersClass();
