import { Request, Response, NextFunction } from 'express';

type AsyncFunc = (req: Request, res: Response, next: NextFunction) => Promise<any>;


export const asyncHandler = (fn:AsyncFunc) => async (req:Request,res:Response,next:NextFunction) =>{
    try {
        await fn(req, res, next);
    } catch (error) {
        console.log("error in async handler",error);
        next(error);
    }
}

