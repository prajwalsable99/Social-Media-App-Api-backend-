const app=require('./app')
const ConnectToMongo = require('./config/db');

ConnectToMongo();

app.listen(process.env.PORT,()=>{

    console.log("APP listening on port : "+ process.env.PORT);
})