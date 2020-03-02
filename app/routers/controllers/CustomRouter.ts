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
        router.use(this.errorsHandler);
        app.use(this.unhandledErrors);
    }

    errorsHandler(err: ErrorType | any, req: Request, res: Response, next: NextFunction) {
        if (err.error) {
            const isSequilize = err.error.status;
            const isDetails = err.error.details;

            const errorObject = isSequilize && err.error
                || isDetails && err.error.details.map((detail: Error) => detail.message)
                || err.error

            res.json({
                status: false,
                error: errorObject,
            }).status(400);

            console.error({
                name: req.method,
                args: {
                    body: req.body,
                    query: req.query,
                },
                error: errorObject,
            });

            return;
        }

        next(err);
    }

    unhandledErrors(req: Request, res: Response) {
        console.error({
            name: req.method,
            args: {
                body: req.body,
                query: req.query,
            },
            error: 'Unhandled errors',
        });

        process.on('uncaughtException', (reason) => {
            console.error(reason);
        });

        process.on('unhandledRejection', (reason) => {
            console.error(reason);
        });

        res.sendStatus(500);
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
