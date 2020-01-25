import { UserModel } from '../models/user';
import { UserType, ErrorsMessage, MutationUsersType, QueryUserType } from '../types/global';
import { Op } from 'sequelize';

export const createUser = async (user: UserType): Promise<MutationUsersType> => {
    const { login, password, age } = user;

    if (login && password && age) {
        try {
            const [user, created] = await UserModel.findOrCreate({where: { login }, defaults: { password, age }});

            if (!created) {
                return {
                    status: false,
                    error: [ErrorsMessage.isExist],
                }
            }

            return {
                status: true,
            };
        } catch (error) {
            return {
                status: false,
                error,
            };
        }
    }

    return {
        status: false,
        error: [ErrorsMessage.uncknownError],
    };
};


export const updateUser = async (user: UserType): Promise<MutationUsersType> => {
    const { id, login, password, age } = user;
    if (id && login && password && age) {
        try {
            const updated: number[] = await UserModel.update(
                { login, password, age },
                { where: { id } }
            );

            if (updated[0] > 0) {
                return {
                    status: true,
                }
            }

            return {
                status: false,
                error: [ErrorsMessage.notFound],
            }

        } catch (error) {
            return {
                status: false,
                error,
            };
        }
    }

    return {
        status: false,
        error: [ErrorsMessage.uncknownError],
    }
};

export const deleteUser = async (id: string): Promise<MutationUsersType> => {
    try {
        const updatedUser = await UserModel.update(
            { isDeleted: true },
            { where: { id } }
        );
        if (updatedUser[0] > 0) {
            return {
                status: true,
            }
        }

        return {
            status: false,
            error: [ErrorsMessage.notFound],
        }
    } catch (error) {
        return {
            status: false,
            error,
        };
    }
}

export const getUserById = async (id: string): Promise<QueryUserType> => {
    try {
        const user = await UserModel.findOne({where: { id }});
        if (user) {
            return {
                status: true,
                user,
            };
        }

        return {
            status: false,
            error: [ErrorsMessage.notFound],
        };
    } catch (error) {
        return {
            status: false,
            error,
        };
    }
};

export const getUsers = async (loginSubstring: string, limit: string): Promise<QueryUserType>  => {
    try {
        const users = await UserModel.findAll({
            where: {
                login: {
                    [Op.like]: `%${loginSubstring}%`,
                },
                isDeleted: {
                    [Op.not]: true,
                },
            },
            limit: Number(limit),
            order: [['login', 'ASC']],
        });
    
        if (Array.isArray(users)) {
            return {
                status: true,
                users,
            }
        }

        return {
            status: false,
            error: [ErrorsMessage.uncknownError],
        }
    } catch (error) {
        return {
            status: false,
            error,
        };
    }
};
