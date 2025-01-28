import mongoose from "mongoose";

const dbConnect=async()=>{
    try{
        const url = "mongodb+srv://iims:iims123@mernstack.uoq97.mongodb.net/Mini-Amazon?retryWrites=true&w=majority&appName=MernStack";
        await mongoose.connect(url);
        console.log("DB connection successful");
    }catch(error){
        console.log("DB connection failed");
        console.log(error.message);    
    }
};

export default dbConnect;