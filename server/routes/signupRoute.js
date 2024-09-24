import express from 'express';
import { User } from '../Backend/model/usermodel.js';
import { hashPassword } from '../Backend/helpers/auth.js';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '../config.js';

const router = express.Router();

router.post('/',async (req,res) => {
    try{
        const {username, fullname, email, mobile, password} = req.body;
        if(!username || !fullname || !email|| !mobile || !password){
            return res.status(400).send({
                message : 'send all required fields'
            });
        }
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if(!usernameRegex.test(username)){
            return res.status(400).send({
                message : "Username cannot contain special characters/blank spaces"
            });
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailRegex.test(email)){
            return res.status(400).send({
                message : "Please Enter a valid email id"
            });
        }
        const emailExist = await User.findOne({email});
        if(emailExist){
            return res.status(400).send({
                message : "Email is already registered"
            });
        }
        const usernameExist = await User.findOne({username});
        if(usernameExist){
            return res.status(400).send({
                message : "Username is already taken"
            });
        }
        const mobileRegex = /^[0-9]{10}$/;
        if(!mobileRegex.test(mobile)){
            return res.status(400).send({
                message : "Please enter a valid Mobile number"
            });
        }
        const passwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;"'<>,.?/~`\\|-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;"'<>,.?/~`\\|-]{8,}$/;
        if(!passwRegex.test(password)){
            return res.status(400).send({
                message : "Password Should contain 1 upper case, 1 Lower case, 1 numerical, and of length min 8 chars"
            });
        }
        const hashedPass = await hashPassword(password);
        const newUser = {
            username,
            fullname,
            email,
            mobile,
            password: hashedPass
        };
        const user = await User.create(newUser);
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
        // return res.status(201).json(user);
    }catch(error){
        console.log(error.message);
        res.status(500).send({message : error.message});
    }
});

export default router;