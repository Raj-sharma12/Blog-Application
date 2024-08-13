const express = require('express');
const app = express();
const path  = require('path'); 

const userRoute  =require('./routes/user');
const blogRoute = require('./routes/blog');
const cookieParser = require('cookie-parser');
const connectWithDB = require('./config/database');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const Blog= require('./models/blog');
require('dotenv').config();

const port= process.env.PORT || 8000;
// connect mongodb with server
connectWithDB();


// use middleware for handle form data
app.use(express.urlencoded({extended:false}));

app.use(express.static(path.resolve('./public')));

app.set('view engine',"ejs");
app.set('views',path.resolve('./views'));
// use middleware for parse cookies
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.get('/',async (req,res) =>{

    const allBlogs = await Blog.find({});
    res.render("home",{
    user:req.user,
    blogs:allBlogs,
    })});





app.use('/user',userRoute);

app.use('/blog',blogRoute);

app.listen(port,() =>{
    console.log(`server started at port no.${port}`);
});