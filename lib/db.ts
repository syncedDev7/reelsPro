import mongoose from "mongoose";
//we use exclamation mark here to tell ts that mongodburi milega hi milega varna error aa rha tha ki what if it is null wala case 
const MONGODB_URI = process.env.MONGODB_URI!
//this error handeling was nessary cause it cant be undefined so typescriot was throwing error 
if (!MONGODB_URI) {
    throw new Error ("mongodb URI is not connected in env file connect it")
}

// mongoose.connect(MONGODB_URI)

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = {conn:null, promise:null}
}
//isse hoga ye ki ya toh cached existkarega agar nahi hoga toh freshly chalega 

export async function connectToDb(){
    //connection already tha
    if (cached.conn) {
        return cached.conn
    }
    if (!cached.promise) {
        //agar promise nahi hai toh create karo 
        const opts = {
            bufferCommands:true,
            maxPoolSize:10
        }
        cached.promise = mongoose
            .connect(MONGODB_URI, opts)
            .then(()=> mongoose.connection)
    //() means arrow function doesnt accept any arguments and return the mongoose.connection after execution
    //complete flow => pehle connect se try karega connect karne ki aur ek promise bhejega and then mai sucessful promise ka resolution hoga and then wo connection object return karega in () wla code 
    }
    //if promise is still ongoing then try catch karo 
    try {
        cached.conn = await cached.promise
    } catch (error) {
        cached.promise = null
        //saara kharab mamla fek de 

        throw new Error("check db file" + error)
    }

return cached.conn;

}


//ye saari bakchodi edge ki vajah se hui hai so search hai 
