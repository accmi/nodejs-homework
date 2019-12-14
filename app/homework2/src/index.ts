import express, { Express } from 'express';

const port = Number(process.env.PORT) || 3000;
const app: Express = express();

app.listen(port, () => console.log(`Server is running on localhost:${port}`));

