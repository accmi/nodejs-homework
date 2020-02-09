import { Sequelize } from 'sequelize';

const databaseName = process.env.DATABASE || '';
const databaseUser = process.env.DATABASE_USER || '';
const databasePassword = process.env.DATABASE_PASSWORD || '';
const databasePort = Number(process.env.DATABASE_PORT) || 3000;
const databaseHost = process.env.DATABASE_HOST || 'localhost';

export const db = new Sequelize(
    databaseName,
    databaseUser,
    databasePassword,
    {
        host: databaseHost,
        port: databasePort,
        dialect: 'postgres',
    }
);
