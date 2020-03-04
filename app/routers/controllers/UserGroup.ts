import {
    Router,
    Response,
    NextFunction,
    Express,
} from 'express';

import {
    addUserToGroup,
} from '../../services';

import { RequestType, ErrorType } from '../../types/global';
import { UserGroupTypes } from '../../types/userGroup';

import AddUsersToGroupType = UserGroupTypes.AddUsersToGroupType;
import UserGroupRoutes = UserGroupTypes.UserGroupRoutes;

class UserGroupRouter {
    constructor(router: Router, app: Express) {
        router.post(UserGroupRoutes.create, this.addUsersToGroup);
    }

    async addUsersToGroup(req: RequestType<AddUsersToGroupType>, res: Response, next: NextFunction) {
        const result = await addUserToGroup(req.body);

        next(result);
    }
}

export const UsersGroupRouter = (router: Router, app: Express) => new UserGroupRouter(router, app);
