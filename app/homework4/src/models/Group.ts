import { STRING, ARRAY, Model, UUID, UUIDV1 } from 'sequelize';
import { db } from '../config/database';
import { UserModel } from './User';
import { UserGroupModel } from './UserGroup';

export class GroupModel extends Model { }

GroupModel.init({
    id: {
        type: UUID,
        defaultValue: UUIDV1,
        primaryKey: true,
    },
    name: {
        type: STRING,
    },
    permissions: {
        type: ARRAY(STRING),
    },
}, {
    sequelize: db,
    modelName: 'Group',
    freezeTableName: true,
});

GroupModel.belongsToMany(UserModel, {
    through: UserGroupModel,
    as: 'users',
    foreignKey: 'groupId',
    otherKey: 'userId',
});
