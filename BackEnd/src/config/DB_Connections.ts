import mongoose from "mongoose";


export const DB_Connections = mongoose.connect("mongodb://127.0.0.1:27017/NotesTs")
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log(err);
})

// module.exports = mongoose.connection;