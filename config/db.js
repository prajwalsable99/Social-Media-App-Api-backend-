const mongoose= require('mongoose');
mongoose.set('strictQuery', false);

const ConnectToMongo=async()=>{
    await mongoose.connect(process.env.DB_URI,()=>{

        console.log("Connected to database successfully")
    })

}

module.exports=ConnectToMongo;