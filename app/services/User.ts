import { UserModel, GroupModel } from '../models';
import { UserTypes } from '../types/user';
import { Op } from 'sequelize';
import JWT from 'jsonwebtoken';
import { Authentication } from './Authentication';

import UserType = UserTypes.UserType;
import ErrorsMessage = UserTypes.ErrorsMessage;
import MutationUsersType = UserTypes.MutationUsersType;
import QueryUserType = UserTypes.QueryUserType;

export const getToken = async (user: UserType, refreshToken: string): Promise<MutationUsersType> => {
    const { login } = user;

    if (login) {
        const isExist = Authentication.checkRefreshToken(refreshToken, login);

        if (isExist) {
            const token = Authentication.getToken(login);

            return {
                status: true,
                tokens: {
                    token,
                }
            }
        };

        return {
            status: false,
            error: [ErrorsMessage.unauthorized],
        }
    }

    return {
        status: false,
        error: [ErrorsMessage.uncknownError],
    };
}

export const loginUser = async (user: UserType): Promise<MutationUsersType> => {
    const { login, password } = user;

    if (login && password) {
        try {
            const user = await UserModel.findOne(
                {
                    where: {
                        login,
                        password,
                    },
                });
            if (user) {
                const tokens = Authentication.getPairAndSetRefreshToken(login);

                return {
                    status: true,
                    tokens,
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
    }

    return {
        status: false,
        error: [ErrorsMessage.uncknownError],
    };
}

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
        const user = await UserModel.findOne(
            {
                where: {id },
                include: [GroupModel],
            });
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
            include: [{
                model: GroupModel,
                as: 'groups',
            }],
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
