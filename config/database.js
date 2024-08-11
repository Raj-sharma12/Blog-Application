const mongoose = require('mongoose');

require('dotenv').config();
const connectWithDB = () =>{
    mongoose.connect(process.env.Database_URL)
    .then(() =>{
        console.log('mongodb connected successfully!');
    })
    .catch((error) =>{
        console.log('database facing errors!');
    })
}

module.exports=connectWithDB;