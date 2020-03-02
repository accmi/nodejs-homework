import { Model, UUIDV1, UUID, ARRAY, STRING } from 'sequelize';
import { db } from '../config/database';
import { UserModel } from './User';
import { GroupModel } from './Group';

export class UserGroupModel extends Model { }

UserGroupModel.init({
    id: {
        type: UUID,
        defaultValue: UUIDV1,
        primaryKey: true
    },
    userId: {
        type: UUID,
        references: {
            model: UserModel,
            key: 'id',
        },
    },
    groupId: {
        type: STRING,
        references: {
            model: GroupModel,
            key: 'id',
        }
    }
}, {
    sequelize: db,
    modelName: 'User_Group',
    freezeTableName: true,
});
