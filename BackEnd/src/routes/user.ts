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
  try {
    let user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const accessToken = jwt.sign(
      { id: newUser._id, name: newUser.name, email: newUser.email },
      "SecretKey"
    );

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    // Send back user data without password and include access token
    res.status(200).json({
      accessToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    bcrypt.compare(password, user.password, (err: Error | undefined, result: boolean) => {
      if (result) {
        const accessToken = jwt.sign(
          { id: user!._id, name: user!.name, email: user!.email },
          "SecretKey",
        );

        res.cookie("token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });

        res.status(200).json({
          accessToken,
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          }
        });
      } 
      else {
        res.status(401).json({ message: "Invalid password" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/logout", (req, res)=>{
  // res.cookie("token", "");
  res.clearCookie("token");
  res.status(200).json({message: "User logged out successfully"});
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
