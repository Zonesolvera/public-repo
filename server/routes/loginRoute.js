import express from 'express';
import { User } from '../Backend/model/usermodel.js';
import { comparePasswords } from '../Backend/helpers/auth.js';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '../config.js';

const router = express.Router();

router.post('/',async (req,res) => {
    try{
        const {credential , password} = req.body;
        let user;
        if(!credential || !password){
            return res.status(400).send({
                message : 'send all required fields'
            });
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(emailRegex.test(credential )){
            user = await User.findOne({email : credential });
        }
        else{
            user = await User.findOne({ username: credential });
        }
        if(!user){
            return res.status(400).send({
                message : "Email/Username is not registered!! Please Create an account first"
            });
        }
        const match = await comparePasswords(password, user.password);
        if(!match){
            return res.status(400).send({
                message : "Wrong Password"
            });
        }
        jwt.sign({
            email : user.email,
            id : user._id,
            username : user.username,
            mobile : user.mobile,
            fullname : user.fullname
        },JWT_SECRET, {}, (err, token) => {
            if(err) throw err;
            console.log("cookie generated");
            return res.cookie('token', token).json(user)
        })
    }catch(error){
        console.log(error.message);
        res.status(500).send({message : error.message});
    }
});

export default router;