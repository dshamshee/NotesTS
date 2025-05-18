import express, { Request, Response } from "express";
const router = express.Router();
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isLoggedin } from "../middleware/isLoggedin";
import NotesModel from "../models/notes";

// Register User
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  let user = await UserModel.findOne({ email });
  if (user) res.send("User already exists");

  try {
    bcrypt.genSalt(10, (err: any, salt: string) => {
      bcrypt.hash(password, salt, async (err: any, hash: string) => {
        const newUser = await UserModel.create({
          name,
          email,
          password: hash,
        });
        const token = jwt.sign(
          { id: newUser._id, name: newUser.name, email: newUser.email },
          "SecretKey"
        );
        res.cookie("token", token);
        res.status(200).json(newUser);
      });
    });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (!user) res.send("Invalid email");

    bcrypt.compare(password, user!.password, (err: Error | undefined, result: boolean) => {
      if (result) {
        const token = jwt.sign(
          { id: user!._id, name: user!.name, email: user!.email },
          "SecretKey",
        );
        res.cookie("token", token);
        res.status(200).json(user);
      } 
      else res.send("Invalid password");
    });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});


router.get("/logout", (req, res)=>{
  // res.cookie("token", "");
  res.clearCookie("token");
  res.status(200).send("User logged out successfully");
});


router.get("/profile", isLoggedin, async (req: Request, res: Response) => {
  const user = req.user;
  try {
    const post = await NotesModel.find({author: user._id});
    res.status(200).json({user, post});
  } catch (error) {
    res.status(500).json({message: "Internal server error"});
  }
  
});

export default router;
