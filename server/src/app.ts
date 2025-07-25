import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import { DbConnect } from "./utils/db";
import authroutes from "./routes/authroutes";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// app.use(express.)


const PORT = process.env.PORT || 6500
app.use("/auth",authroutes);
DbConnect().then(()=>{
    app.listen(PORT,()=>{
        console.log(`server is listening at ${PORT}`)
    })
    
})
.catch((error)=>{
    console.log("error in app.ts",error)
});
