//create a model for user
const mongoose = require('mongoose');
const {model}  = require('mongoose');
const {createHmac,randomBytes} =  require('node:crypto');
const { createTokenForUser } = require('../service/authentication');

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
        },
        profileImage:{
            type:String,
            default:"../public/images/default.png",
        },
        role:{
            type:String,
            enum:["ADMIN","USER"],
            default:"USER",
        }
},{timestamps:true});

// use pre save middleware   before  save the data of user  perform some operation 
userSchema.pre('save',function(next){
    const user = this;//current user
    // check if user not modify then or password did not modify then just simply return 
    if(!user.isModified('password')) return;
    // bnefore save the password in db we hash or encrypt the password using built-in package cryptohash
    // /create a salt which is a random strng
    const salt = randomBytes(16).toString();//salt is a secret key it is uniwue for every user
    // create a hash of password
    const hashedPassword = createHmac('sha-256',salt).update(user.password).digest('hex');
    console.log("hashedPassword",hashedPassword);
    this.salt = salt;
    this.password = hashedPassword;

    next();

})

// logic for signin
userSchema.static('matchPasswordAndGenerateToken',async function(email,password){
    // from frontend user provide the email,password
    // now find this user using email in db
    const user = await this.findOne({email});
    // if user not meet
    if(!user){
        throw new Error("user not found!");
    }
    //if user found
    // take the salt of db user
    const salt= user.salt; //db salt
    const hashedPassword =user.password; //db password

    // password fron frontend convert in hash
    const userProvidedHash = createHmac('sha256',salt).update(password).digest('hex');

    if(hashedPassword !== userProvidedHash){
        throw new Error("password did not match!");
    }

    //if password match just generate a token
    const token = createTokenForUser(user);
    return token;

    //if password will be match just return user
    // return {...user,password:undefined,salt:undefined};
})

const User = model("user",userSchema);
module.exports = User;

