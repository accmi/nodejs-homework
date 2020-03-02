import { STRING, ARRAY, UUID, Model, UUIDV1, ENUM } from 'sequelize';
import { GroupTypes } from '../types/group';
import { db } from '../config/database';

import GroupPermissions = GroupTypes.GroupPermissions;

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
        type: ARRAY(ENUM(
            GroupPermissions.DELETE,
            GroupPermissions.READ,
            GroupPermissions.SHARE,
            GroupPermissions.UPLOAD_FILES,
            GroupPermissions.WRITE,
        )),
    },
}, {
    sequelize: db,
    modelName: 'Group',
    freezeTableName: true,
});
