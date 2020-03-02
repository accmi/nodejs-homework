import * as Joi from '@hapi/joi'
import { GroupTypes } from '../types/group';

import GroupPermissions = GroupTypes.GroupPermissions;

export const groupValidationSchema = Joi.object({
    id: Joi.string(),
    name: Joi.string().required(),
    permissions: Joi.array().required(),
});
