const mongoose =require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')


const UserSchema =new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter name"]
    },
    email:{
        type:String,
        unique:[true,"email alreday exists"],
        required:[true,"please enter email"]
    },
    avatar:{
        public_id:String,
        url:String
    },
    password:{
        type:String,
        required:[true,"please enter password"],
        minlength:[4,"password must be atlesat 4 char long"],
        select:false ,
    },
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post",
        
        }
    ],

    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        
        }
    ]

})

UserSchema.pre("save",async function (next){
    if(this.isModified("password")){

        this.password=await bcrypt.hash(this.password,10);
    }
    next()
} )

UserSchema.methods.checkPassword= async function (password){
    return await bcrypt.compare(password,this.password);
}

UserSchema.methods.createToken= async function (){
   
    const token= await jwt.sign({_id:this._id},process.env.SECRET);
    // console.log(token);
    return token;
}

module.exports=mongoose.model("User",UserSchema);