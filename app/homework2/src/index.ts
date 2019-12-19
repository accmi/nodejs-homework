import express, { Express } from 'express';
import { createUser, getUserById, getUsers, updateUser, deleteUser } from './controllers/users.controllers';
import { UserRoutes } from './types/global';
import { urlencoded } from 'body-parser';

const port = Number(process.env.PORT) || 8000;
const app: Express = express();

app.use(urlencoded({ extended: true }));

app.post(UserRoutes.create, createUser);
app.get(UserRoutes.getUser, getUserById);
app.get(UserRoutes.getUsers, getUsers);
app.put(UserRoutes.update, updateUser);
app.delete(UserRoutes.delete, deleteUser);


app.listen(port, () => console.log(`Server is running on localhost:${port}`));
