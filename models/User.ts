//install bcryptjs 
//everything is cached so kuch chize leni padti hai 
import mongoose, { models } from "mongoose";
import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
export interface IUser{
    email: string;
    password:string ;
    //optional hai means ?
    _id?:mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt: Date
} 


const userSchema = new Schema<IUser>(
    //field defination main object => defination of your field and each field has options like unique etc
    {
        email:{type:String , required: true , unique:true},
        password:{type:String , required : true}
    },
    //second curly brace => contanis schema level optiins eg=> timestamp , versionkey , toJson
    {timestamps:true}
)
//save karne se pehle ek prehook chalao jab firsttime save karunga toh chalao hi chalo but if i modify password then we will encrypt it and save it 
userSchema.pre("save", async function (next){
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password,10)   
    }
    next()
})

//   || wala returns first truthy value of thius statement which means dono mai se jo pehle true hoga wo return hoga 
const User = models?.User || model<IUser>("User", userSchema)
//agar already ek user hai toh wahi dedo ya fir ye wala newly created dedo 
//models mai saare models deta hai whereas model wala bas ek hi deta hai 
export default User 