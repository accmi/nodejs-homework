import {
    Router,
    Response,
    Request,
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
import MutationUserGroupType = UserGroupTypes.MutationUserGroupType;

class UserGroupRouter {
    constructor(router: Router, app: Express) {
        router.post(UserGroupRoutes.create, this.addUsersToGroup);

        router.use(UserGroupRoutes.common, this.statusDetect);
        app.use(UserGroupRoutes.common, this.errorsHandler);
    }

    errorsHandler(err: ErrorType | any, req: Request, res: Response, next: NextFunction) {
        if (err.error) {
            const errorObject = err.error.details ? err.error.details.map((detail: Error) => detail.message): err;

            res.json({
                status: false,
                error: errorObject,
            }).status(400);

            return;
        }

        res.json(err).status(500);
    }

    statusDetect(result: MutationUserGroupType, req: RequestType, res: Response, next: NextFunction) {
        if (result.status) {
            res.json(result).status(200);

            return;
        }

        next(result);
    }

    async addUsersToGroup(req: RequestType<AddUsersToGroupType>, res: Response, next: NextFunction) {
        const result = await addUserToGroup(req.body);

        next(result);
    }
}

export const UsersGroupRouter = (router: Router, app: Express) => new UserGroupRouter(router, app);
