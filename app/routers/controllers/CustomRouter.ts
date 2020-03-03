import {
    Router,
    Response,
    Request,
    NextFunction,
    Express,
} from 'express';
import { RequestType, ErrorType, ErrorResponseType } from '../../types/global';
import { UsersRouter, GroupsRouter, UsersGroupRouter } from '.';
import { logger } from '../../logger';

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

            logger.log({
                message: req.method,
                level: 'error',
                args: {
                    body: req.body,
                    query: req.query,
                },
                error: errorObject,
            });

            return;
        }

        next();
    }

    unhandledErrors(req: Request, res: Response) {
        logger.log({
            message: req.method,
            level: 'error',
            args: {
                body: req.body,
                query: req.query,
            },
            error: 'Unhandled errors',
        });

        process.on('uncaughtException', (reason) => {
            logger.log({
                message: req.method,
                level: 'error',
                args: {
                    body: req.body,
                    query: req.query,
                },
                error: `uncaught exception: ${reason}`,
            });
        });

        process.on('unhandledRejection', (reason) => {
            logger.log({
                message: req.method,
                level: 'error',
                args: {
                    body: req.body,
                    query: req.query,
                },
                error: `unhandled rejection: ${reason}`,
            });
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
