const mongoose = require('mongoose');


const connectWithDB = () =>{
    mongoose.connect('mongodb://localhost:27017/Blog-server')
    .then(() =>{
        console.log('mongodb connected successfully!');
    })
    .catch((error) =>{
        console.log('database facing errors!');
    })
}

module.exports=connectWithDB;