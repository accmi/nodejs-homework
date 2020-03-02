import {
    Router,
    Response,
    Request,
    NextFunction,
    Express,
} from 'express';
import { RequestType, ErrorType, ErrorResponseType } from '../../types/global';
import { UsersRouter, GroupsRouter, UsersGroupRouter } from '.';

export class CustomRouterClass {
    constructor(router: Router, app: Express) {
        UsersRouter(router, app);
        GroupsRouter(router, app);
        UsersGroupRouter(router, app);
        
        // Errors handling
        router.use(this.statusDetect);
        app.use(this.errorsHandler);
    }

    errorsHandler(err: ErrorType | any, req: Request, res: Response, next: NextFunction) {
        if (err.error) {
            const isSequilize = err.error.status;
            const isDetails = err.error.details;

            const errorObject = isSequilize && err.error
                || isDetails && err.error.details.map((detail: Error) => detail.message)
                || err.error
                || err;

            res.json({
                status: false,
                error: errorObject,
            }).status(400);

            return;
        }

        res.json(err).status(500);
    }

    statusDetect(result: ErrorResponseType, req: RequestType, res: Response, next: NextFunction) {
        if (result.status) {
            res.json(result).status(200);

            return;
        }

        next(result);
    }
};

export const CustomRouter = (router: Router, app: Express) => new CustomRouterClass(router, app);
