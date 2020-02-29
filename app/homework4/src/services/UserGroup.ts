import { UserGroupTypes } from '../types/userGroup';
import { UserGroupModel } from '../models'
import { db } from '../config/database';

import AddUsersToGroupType = UserGroupTypes.AddUsersToGroupType;
import MutationUserGroupType = UserGroupTypes.MutationUserGroupType;
import ErrorsMessage = UserGroupTypes.ErrorsMessage;
import { Transaction } from 'sequelize/types';

export const addUserToGroup = async (params: AddUsersToGroupType): Promise<MutationUserGroupType> => {
    const { groupId, userIds } = params;
    
    if (groupId && userIds) {
        try {
            return await db.transaction(async (transaction: Transaction) => {
                userIds.forEach( async(userId: string) => {
                    await UserGroupModel.create({
                        groupId,
                        userId,
                    }, { transaction });
                })
    
                return {
                    status: true,
                };
            })
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
