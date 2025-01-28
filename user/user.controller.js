import express from "express";
import UserTable from "./user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Yup from "yup";

const router = express.Router();
//Register User
router.post(
  "/user/register",
  async (req, res, next) => {
    // create schema
    const userValidationSchema = Yup.object({
      fullName: Yup.string().required().trim().max(255),
      email: Yup.string().email().required().trim().max(100).lowercase(),
      address: Yup.string().notRequired().max(255).trim(),
      password: Yup.string().required().trim().min(8).max(30),
      gender: Yup.string()
        .required()
        .trim()
        .oneOf(["Male", "Female", "Others", "PreferNotToSay"]),

      phoneNumber: Yup.string().notRequired().trim().min(10).max(20),
    });

    try {
      req.body = await userValidationSchema.validate(req.body);
      next();
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },

  async (req, res) => {
    //extract new user from req body
    const newUser = req.body;

    //find user with provided email
    const user = await UserTable.findOne({ email: newUser.email });
    //is user.threw err
    if (user) {
      return res.status(409).send({ message: "Email already exists" });
    }
    //hash password
    //plain password, salt Rounds
    const plainPassword = newUser.password;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    //replace plain password by hash password
    newUser.password = hashedPassword;
    await UserTable.create(newUser);
    return res
      .status(201)
      .send({ message: "User is registered successfully...." });
  }
);

//Login User
router.post("/user/login", async(req, res)=>{
     
    //extract login credential from req.body
    const loginCredentials= req.body;
    //find user with provided email
    const user= await UserTable.findOne({email:loginCredentials.email});
    if(!user){
        return res.status(404).send({message:"Invalid Credentials"})
    }
    //password check
    //need to compare plain password with hashed password
    //plain password is provided by the user and hashed password is saved in db
    const plainPassword=loginCredentials.password;

    const hashedPassword=user.password;
    const isPasswordMatch= await bcrypt.compare(plainPassword, hashedPassword);
     if (!isPasswordMatch) {
       return res.status(404).send({ message: "Invalid Credentials" });
     }
     //remove password
     user.password=undefined;

     //generate access token
     //secretKey
     const secretKey="adjfsdfjdskfjsdf";
     //payload: object inside the token
     const payLoad={email:user.email};
     //encrypted cipher text
     const token = jwt.sign(payLoad, secretKey, {
      expiresIn: "7d",
     });
     console.log(token);

    return res.status(200).send({message: "User is successfully logged in", userDetails:user, accessToken:token});
})

export {router as userController};  