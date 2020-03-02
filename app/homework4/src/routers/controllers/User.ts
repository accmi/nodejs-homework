import {
    Router,
    Response,
    Request,
    NextFunction,
    Express,
} from 'express';

import {
    createUser,
    updateUser,
    getUserById,
    getUsers,
    deleteUser,
} from '../../services';

import { RequestType, ErrorType } from '../../types/global';
import { userValidationSchema } from '../../validators';
import { createValidator } from 'express-joi-validation'
import { UserTypes } from '../../types/user';

import UserType = UserTypes.UserType;
import UserRoutes = UserTypes.UserRoutes;
import UserModelResultType = UserTypes.UserModelResultType;
import GetUserByIdType = UserTypes.GetUserByIdType;
import GetUsersType = UserTypes.GetUsersType;


const validator = createValidator({
    passError: true,
});

class UserRouter {
    constructor(router: Router, app: Express) {
        router.post(UserRoutes.create, validator.body(userValidationSchema), this.createUser);
        router.put(UserRoutes.update, validator.body(userValidationSchema), this.updateUser);
        router.delete(UserRoutes.delete, this.deleteUser);
        router.get(UserRoutes.getUser, this.getUser);
        router.get(UserRoutes.getUsers, this.getUsers);
        router.use(UserRoutes.common, this.statusDetect);

        app.use(UserRoutes.common, this.errorsHandler);
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

    statusDetect(result: UserModelResultType, req: RequestType, res: Response, next: NextFunction) {
        if (result.status) {
            res.json(result).status(200);

            return;
        }

        next(result);
    }

    async createUser(req: RequestType<UserType>, res: Response, next: NextFunction) {
        const result = await createUser(req.body);

        next(result);
    }

    async updateUser(req: RequestType<UserType>, res: Response, next: NextFunction) {
        const result = await updateUser(req.body);

        next(result);
    }

    async deleteUser(req: RequestType<{}, GetUserByIdType>, res: Response, next: NextFunction) {
        const result = await deleteUser(req.query.id);

        next(result);
    }

    async getUser(req: RequestType<{}, GetUserByIdType>, res: Response, next: NextFunction) {
        const result = await getUserById(req.query.id);

        next(result);
    }

    async getUsers(req: RequestType<{}, GetUsersType>, res: Response, next: NextFunction) {
        const { query: { loginSubstring, limit } } = req;
        const result = await getUsers(loginSubstring, limit);

        next(result);
    }
}

export const UsersRouter = (router: Router, app: Express) => new UserRouter(router, app);
