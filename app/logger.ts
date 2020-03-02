import morgan from 'morgan';
import { RequestType } from './types/global';

morgan.token('args', (req: RequestType) => {
    return JSON.stringify({
        query: req.query,
        body: req.body,
    });
});

export const logger = morgan(
    ':method :args :status :res[content-length] - :response-time ms',
);
