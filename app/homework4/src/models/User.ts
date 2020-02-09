import { STRING, BOOLEAN, INTEGER, Model, UUID, UUIDV1 } from 'sequelize';
import { db } from '../config/database';
import { GroupModel } from './Group';
import { UserGroupModel } from './UserGroup';

export class UserModel extends Model { }

UserModel.init({
    id: {
        type: UUID,
        defaultValue: UUIDV1,
        primaryKey: true
    },
    login: {
        type: STRING,
    },
    password: {
        type: STRING,
    },
    age: {
        type: INTEGER,
    },
    isDeleted: {
        type: BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize: db,
    modelName: 'User',
    freezeTableName: true,
});

UserModel.belongsToMany(GroupModel, {
    through: UserGroupModel,
    as: 'groups',
    foreignKey: 'userId',
    otherKey: 'groupId',
});
