import express from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Add this
import {DB_Connections} from "./config/DB_Connections";
// import UserModel from "./models/user";
// import NoteModel from "./models/note";
import indexRouter from "./routes/index";
import userRouter from "./routes/user";
import noteRouter from "./routes/note";


const app = express();
if(!DB_Connections) console.log("Error connecting to MongoDB");

// Enable CORS for specific origin
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

// Essential middleware
app.use(express.json()); // For parsing JSON request bodies
app.use(express.urlencoded({ extended: true })); // For form data
app.use(cookieParser()); // For handling cookies
// Handle preflight requests
app.options('*', cors());



app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/note", noteRouter);



app.listen(3000);