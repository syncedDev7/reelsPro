import User  from "@/models/User";
import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import { connectToDb } from "./db";
import bcrypt from "bcryptjs";
//firstly we will define providers ka array 
//ye jo object hai wo inject hoga in [] wali file
export const authOptions: NextAuthOptions ={
    //1.handeling providers 
    providers:[
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                email: {label:"Email", type:"text"},
                password: {label:"password", type:"password"}
            },
            async authorize(credentials){
                if (!credentials?.email || !credentials?.password) {
                    throw new Error ("missing email or password ")
                }

                try {
                    await connectToDb()
                    //finding the user
                    const user = await User.findOne({email: credentials.email})

                    if (!user) {
                        throw new Error("no user found")
                    }
                    //checking if password is valid or not 
                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )
                    if (!isValid) {
                        throw new Error ("password didnt match")
                    }
                    //now sucessful so returning object to our session
                    return{
                        id: user._id.toString(),
                        email:user.email
                    }
                } catch (error) {
                    throw error 
                }
            }
        })
    ],
    //2.handeling callbacks 
    callbacks:{
        async jwt({token,user}){
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({session,token}){

            if (session.user) {
                session.user.id = token.id as string 
            }

            return session
        }
    },
    pages:{
        signIn:"/login",
        error:"/login"
    },
    session:{
        strategy:"jwt",
        maxAge:30*24*60*60
    },
    secret: process.env.NEXTAUTH_SECRET
}


// lets us decide wheteher we wanttot store sessions in db or jwt we chose jwt so we got both 
// 1:41:16
//check what is differnce between db and jwt 
//check when to use export default and export const 