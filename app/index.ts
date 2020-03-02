require('dotenv').config();
import express, { Express, Router } from 'express';
import { urlencoded, json } from 'body-parser';
import { db } from './config/database';
import { UserModel, GroupModel, UserGroupModel } from './models';
import { UsersRouter, GroupsRouter, UsersGroupRouter } from './routers/controllers';

const port = Number(process.env.PORT) || 9000;
const app: Express = express();
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

app.listen(port, () => console.log(`Server is running on localhost:${port}`));
app.use(urlencoded({ extended: true }));
app.use(json());
app.use('/', router);


UsersRouter(router, app);
GroupsRouter(router, app);
UsersGroupRouter(router, app);
