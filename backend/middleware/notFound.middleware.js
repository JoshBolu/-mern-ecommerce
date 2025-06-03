import { StatusCodes } from 'http-status-codes';

export const notFound = ( req, res, next) => {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Route does not exist' });
    next();
}