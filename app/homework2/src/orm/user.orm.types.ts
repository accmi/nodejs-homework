export namespace UsersOrmTypes {
    export interface UserType {
        id?: string;
        login?: string;
        password?: string;
        age?: number;
        isDeleted?: boolean;
    }
}
