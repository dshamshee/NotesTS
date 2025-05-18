import mongoose, { mongo } from "mongoose";


const UserSchema = new mongoose.Schema({
    name: String, 
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password:{
        type: String,
        required: true
    },
    avatar:{
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    notes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
        required: true
    }]
})

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;