import { Request, Response, NextFunction } from 'express';
import * as JWT from 'jsonwebtoken';
import { logger } from '../logger';
import { UserTypes } from '../types/user';

import ErrorsMessage = UserTypes.ErrorsMessage;
import UserRoutes = UserTypes.UserRoutes;
import { ErrorResponseType } from '../types/global';

class Auth {
    refreshTokens: {[key: string]: string} = {};

    getPairAndSetRefreshToken(login: string) {
        const secret = process.env.SECRET || 'SECRET';
        const refreshSecret = process.env.REFRESH_SECRET || 'REFRESH_SECRET';

        const token = JWT.sign({ login }, secret, { expiresIn: '1m' });
        const refreshToken = JWT.sign({ login }, refreshSecret, { expiresIn: '5m' });

        this.setRefreshToken(refreshToken, login);

        return {
            token,
            refreshToken,
        }
    }

    getToken(login: string) {
        const secret = process.env.SECRET || 'SECRET';

        return JWT.sign({ login }, secret, { expiresIn: '1m' });
    }

    setRefreshToken(token: string, login: string) {
        this.refreshTokens = {
            [token]: login,
        }
    };

    checkRefreshToken(token: string, login: string) {
        const refreshToken = this.refreshTokens[token];

        return refreshToken && (refreshToken === login);
    }

    checkToken(req: Request, res: Response, next: NextFunction) {
        const token = req.get('x-token');
        const secret = process.env.SECRET || 'SECRET';
        const pathName = req.path;

        if (pathName && (pathName === UserRoutes.login)) {
            return next();
        }

        if (token && token.length > 0) {
            try {
                JWT.verify(token, secret);

                return next();   
            } catch (error) {
                return next({
                    status: false,
                    error: [ErrorsMessage.forbidden],
                    errorDetail: error,
                });
            }
        }

        next({
            status: false,
            error: [ErrorsMessage.unauthorized],
        });
    };

    errorTokenHandler(result: ErrorResponseType, req: Request, res: Response, next: NextFunction) {
        if (!result.status) {
            logger.log({
                message: req.method,
                args: {
                    query: req.query,
                    body: req.body
                },
                error: result.error,
                errorDetail: result.errorDetail,
                operation: 'request',
                level: 'error'
            });
    
            if (Array.isArray(result.error) && result.error.includes(ErrorsMessage.unauthorized)) {
                return res.sendStatus(401);
            }
    
            if (Array.isArray(result.error) && result.error.includes(ErrorsMessage.forbidden)) {
                return res.sendStatus(403);
            }
    
            return res.sendStatus(500);
        }
    
        return next();
    }
};

export const Authentication = new Auth();
