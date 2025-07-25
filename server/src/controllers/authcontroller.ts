import bcrypt from 'bcrypt'; // used to hash and undo the hash
import oracledb from 'oracledb';
import { Request, Response } from 'express';
import express from "express";
import { DbConnect, getDBConnection } from '../utils/db';
type user = {
    id: number,
    username: string,
    password: string,
    email: string

}
const authrouter = express.Router();

export const signup = async (req: Request, res: Response) => {
    console.log("got the request",req);
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'All fields required' });

  const hashed = await bcrypt.hash(password, 10); // 10 refers to no of rounds for hashing
  const conn = await oracledb.getConnection();
   const user = await conn.execute(
     `SELECT * FROM ADMIN_LOGIN WHERE USERNAME=:username`,[username],
     {outFormat: oracledb.OUT_FORMAT_OBJECT }
   );
   if(user.rows?.[0]){
      return res.status(402).json({
        message:"User already exists"
     })
   }

  await conn.execute(
    `INSERT INTO admin_login (username, email, password) VALUES (:username, :email, :password)`,
    [username, email, hashed],
    { autoCommit: true }
  );

  await conn.close();
   return res.status(201).json({ message: 'User registered' });
};
export const login = async (req: Request, res: Response) => {
    try {
        console.log("Req is received",req.body);
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'All fields required' });
        await DbConnect();
        const conn = await getDBConnection();
        const result = await conn.execute(
            `SELECT * FROM admin_login WHERE username = :username`,
            [username],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        await conn.close();

       const user = result.rows?.[0] as { id:number,username:string , password:string} ;
        console.log(user);
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        // const match = await bcrypt.compare(password, user.password);
        const match = (password===user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        res.json({ message: 'Login successful', user: { id: user?.id, username: user?.username } });
    } catch (err) {
        console.log("error is at login",err);
    }
};


export default authrouter;
