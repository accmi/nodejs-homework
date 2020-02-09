import { Model, UUID } from 'sequelize';
import { db } from '../config/database';

export class UserGroupModel extends Model { }

UserGroupModel.init({
    userId: {
        type: UUID,
    },
    groupId: {
        type: UUID,
    }
}, {
    sequelize: db,
    modelName: 'User_Group',
    freezeTableName: true,
});
