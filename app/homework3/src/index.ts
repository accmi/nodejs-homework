require('dotenv').config();
import express, { Express, Router } from 'express';
import { urlencoded } from 'body-parser';
import { db } from './config/database';
import { UserModel } from './models/user';
import { UsersRouter } from './routers/controllers/User';

const port = Number(process.env.PORT) || 9000;
const app: Express = express();
const router: Router = Router();

db.authenticate()
    .then(() => {
        console.log('Database connected');
        UserModel.sync();
    })
    .catch((err: Error) => console.log(`Database connection error: ${err}`));

app.listen(port, () => console.log(`Server is running on localhost:${port}`));

app.use(urlencoded({ extended: true }));
app.use('/', router);


UsersRouter(router, app);
