import UserModel from "../models/user";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
    id: string;
}

// Extend Express Request type
declare module 'express' {
    interface Request {
        user?: any;  // You might want to replace 'any' with your actual User type
    }
}

export const isLoggedin = async (req: any, res: any, next: any) => {
    try {
        if(!req.cookies.token) return res.status(401).send("Unauthorized");

        const decoded = jwt.verify(req.cookies.token, "SecretKey") as JwtPayload;
        const user = await UserModel.findOne({_id: decoded.id}).select("-password");
        // console.log(decoded.id);
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send("Something went wrong");
    }
}