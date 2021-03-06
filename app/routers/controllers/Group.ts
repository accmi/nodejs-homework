import {
    Router,
    Response,
    NextFunction,
    Express,
} from 'express';

import {
    createGroup,
    updateGroup,
    getGroupById,
    getGroups,
    deleteGroup,
} from '../../services';

import { RequestType, ErrorType } from '../../types/global';
import { groupValidationSchema } from '../../validators';
import { createValidator } from 'express-joi-validation'
import { GroupTypes } from '../../types/group';

import GroupType = GroupTypes.GroupType;
import GroupRoutes = GroupTypes.GroupRoutes;
import GetGroupByIdType = GroupTypes.GetGroupByIdType;


const validator = createValidator({
    passError: true,
});

class GroupRouter {
    constructor(router: Router, app: Express) {
        router.post(GroupRoutes.create, validator.body(groupValidationSchema), this.createGroup);
        router.put(GroupRoutes.update, validator.body(groupValidationSchema), this.updateGroup);
        router.delete(GroupRoutes.delete, this.deleteGroup);
        router.get(GroupRoutes.getGroup, this.getGroupById);
        router.get(GroupRoutes.getGroups, this.getGroups);
    }

    async createGroup(req: RequestType<GroupType>, res: Response, next: NextFunction) {
        const result = await createGroup(req.body);

        next(result);
    }

    async updateGroup(req: RequestType<GroupType>, res: Response, next: NextFunction) {
        const result = await updateGroup(req.body);

        next(result);
    }

    async deleteGroup(req: RequestType<{}, GetGroupByIdType>, res: Response, next: NextFunction) {
        const result = await deleteGroup(req.query.id);

        next(result);
    }

    async getGroupById(req: RequestType<{}, GetGroupByIdType>, res: Response, next: NextFunction) {
        const result = await getGroupById(req.query.id);

        next(result);
    }

    async getGroups(req: RequestType<{}, {}>, res: Response, next: NextFunction) {
        const result = await getGroups();

        next(result);
    }
}

export const GroupsRouter = (router: Router, app: Express) => new GroupRouter(router, app);
