import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import User from "@/models/User";

export async function GET(){
    return NextResponse.json(
        {msg:"hello"}
    )
}

export async function POST(request:NextRequest){
    try {
        const {email, password} = await request.json()
        if (!email || !password) {
            return NextResponse.json(
                {error:"email or password not recied "},
                {status: 400}
            )
        }
        await connectToDb()

        //check if user registerd or not 
        const existerror = await User.findOne({email})
        if (existerror) {
            return NextResponse.json(
                {error:"User already exist with that email"},
                {status: 400}
            )
        }

        //creating the user 
        await User.create({
            email,
            password
        })
        //returning sucess response 
        return NextResponse.json(
            {message:"user registerd sucessfully"},
            {status: 201}
        )
    } catch (error) {
        console.log(error);
        
        return NextResponse.json(
                {error:"failed to register User"},
                {status: 500}
        )
    }
}