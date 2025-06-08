//declaring the globa object 
import { Connection } from "mongoose"
declare global{
    var mongoose:{
        conn:Connection | null 
        promise: Promise<Connection> | null
    }

}

//linting error hai ignore this bs 
// iss mongoose mai ya toh connection type ka aaega jo ki mongoose mai hoga  ya fir promise aaega jo ki resolve ho rha hoga 