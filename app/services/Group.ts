import { GroupModel, UserModel } from '../models';
import { GroupTypes } from '../types/group';

import GroupType = GroupTypes.GroupType;
import MutationGroupsType = GroupTypes.MutationGroupsType;
import ErrorsMessage = GroupTypes.ErrorsMessage;
import QueryGroupType = GroupTypes.QueryGroupType;

export const createGroup = async (group: GroupType): Promise<MutationGroupsType> => {
    const { name, permissions } = group;

    if (name && permissions) {
        try {
            const [group, created] = await GroupModel.findOrCreate({where: { name }, defaults: { name, permissions }});

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


export const updateGroup = async (group: GroupType): Promise<MutationGroupsType> => {
    const { id, name, permissions } = group;
    if (id && name && permissions) {
        try {
            const updated: number[] = await GroupModel.update(
                { name, permissions },
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

export const deleteGroup = async (id: string): Promise<MutationGroupsType> => {
    try {
        const deletedGroup = await GroupModel.destroy(
            { where: { id } }
        );
        if (deletedGroup > 0) {
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

export const getGroupById = async (id: string): Promise<QueryGroupType> => {
    try {
        const group = await GroupModel.findOne({where: { id }});
        if (group) {
            return {
                status: true,
                group,
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

export const getGroups = async (): Promise<QueryGroupType>  => {
    try {
        const groups = await GroupModel.findAll({
            include: [{
                model: UserModel,
                as: 'users',
            }],
        });
    
        if (Array.isArray(groups)) {
            return {
                status: true,
                groups,
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
