import express from 'express';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '../config.js';

const router = express.Router();

router.get('/',async (req,res) => {
    const token = req.cookies.jwt;
    if(!token) return res.status(401).send('Access Denied');
    try{
        const verified = jwt.verify(token, JWT_SECRET);
        res.json({
            username : verified.username,
            email : verified.email,
            mobile : verified.mobile,
            fullname : verified.fullname
        });
    }catch(error){
        res.status(400).send('Invalid Token');
    }
});

export default router;