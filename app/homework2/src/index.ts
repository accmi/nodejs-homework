import express, { Express, urlencoded, Router } from 'express';
import { UsersRouter } from './resources/users/router';

const port = Number(process.env.PORT) || 8000;
const app: Express = express();
const router: Router = Router();

app.listen(port, () => console.log(`Server is running on localhost:${port}`));

app.use(urlencoded({ extended: true }));
app.use('/', router);


UsersRouter(router, app);
