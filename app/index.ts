require('dotenv').config();
import express, { Express, Router, Request, Response, NextFunction } from 'express';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import { logger } from './logger';
import { db } from './config/database';
import { UserModel, GroupModel, UserGroupModel } from './models';
import { CustomRouter } from './routers/controllers';
import { Authentication } from './services/Authentication';

const port = Number(process.env.PORT) || 9000;
export const app: Express = express();
const router: Router = Router();

db.authenticate()
    .then(() => {
        console.log('Database connected');
        GroupModel.sync();
        UserModel.sync();
        UserGroupModel.sync();

        UserModel.belongsToMany(GroupModel, {
            through: UserGroupModel,
            as: 'groups',
            foreignKey: 'userId'
        });

        GroupModel.belongsToMany(UserModel, {
            through: UserGroupModel,
            as: 'users',
            foreignKey: 'groupId'
        });
    })
    .catch((err: Error) => console.log(`Database connection error: ${err}`));
app.use(cors());
app.listen(port, () => console.log(`Server is running on localhost:${port}`));

app.use(urlencoded({ extended: true }));
app.use(json());
app.use('*', (req: Request, res: Response, next: NextFunction) => {
    logger.log({
        message: req.method,
        args: {
            query: req.query,
            body: req.body
        },
        operation: 'request',
        level: 'info'
    });
    next();
});
app.use('/', Authentication.checkToken);
app.use(Authentication.errorTokenHandler);
app.use('/', router);
CustomRouter(router, app);
