import express, { Response,Request,NextFunction } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import { signup,login } from '../controllers/authcontroller';
import {parseData } from "../middlewares/parseFormData" 
const router = express.Router();

router.post('/signup',parseData(), asyncHandler(signup));
router.post('/login', (req: Request, res: Response,next:NextFunction) => {
   try {
    res.json({message:"ok"})
     
   } catch (error) {
    next(error)
   }
});

export default router;
