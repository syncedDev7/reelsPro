import { authOptions } from "@/lib/auth";
import { connectToDb } from "@/lib/db";

import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

//to get all vids 
export async function GET(){
    try {
        await connectToDb()
        //saare videos leke aao and all should be sorted as first come first serve 
        const videos = await Video.find({}).sort({createdAt:-1}).lean()
        //lean returns plain js which reduces load on serve na bhi likho toh bhi chalega but it is a best practise 
        if (!videos || videos.length==0) {
            return NextResponse.json([], {status:200})
        }
        if (videos) {
            return NextResponse.json(videos)
        }
    } catch (error) {
        return NextResponse.json(
            {error: "failed to fetch videos"},
            {status:200}
        )
    }
}
//to post vids on server 

export async function POST(request:NextRequest){

    //allowing those who are regisred we get servessesion method in next itself use it 
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                {error:"user is not authorised"},
                {status:401}
            )
        }
        await connectToDb()
        const body:IVideo = await request.json()
        if (!body.title || !body.description || !body.videoUrl || !body.thumbnailUrl) {
                 return NextResponse.json(
                {error:"missing required fields"},
                {status:401}
            )
        }

        const videoData = {
            ...body,
            controls:body.controls ?? true,
            transformation:{
                height:1920,
                width:1080,
                quality:body.transformation?.quality ?? 100

            }
        }
        const newVideo = await Video.create(videoData)
        return NextResponse.json(newVideo)



    } catch (error) {
        // console.log(error);
        
            return NextResponse.json(
            {error:"video not uploaded sucessfully "},
                {status:401}
            )
    }
}
