import { UsersOrmTypes } from './user.orm.types';
import UserType = UsersOrmTypes.UserType;

class UsersClass {
    users: UserType[] = [];

    create(newUser: UserType): boolean {
        const isUserExist = this.users.some((user) => user.id === newUser.id);

        if (isUserExist) {
            return false;
        }
        
        this.users.push(newUser);

        return true;
    }

    update(user: UserType): boolean {
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

            return true;
        }

        return false;
    }

    getUserById(id: string): UserType | boolean {
        const needUser = this.users.find((user) => user.id === id);

        if (needUser) {
            return needUser;
        }

        return false;
    }

    delete(id: string): boolean {
        const userIndex = this.users.findIndex((user) => user.id === id);

        if (userIndex >= 0) {
            this.users[userIndex].isDeleted = true;

            return true;
        }

        return false;
    }

    getUsers(loginSubstring: string, limit: number) {
        const result = this.users
            .filter((user, index) => (
                user.login
                && user.login.search(loginSubstring) >= 0
                && index < limit
            ))
            .sort((a, b) => a.login && b.login ? a.login.localeCompare(b.login) : -1);
        return result;
    }
}

export const Users = new UsersClass();
