const { checkForAuthenticationCookie } = require('../middlewares/authentication');
const User=require('../models/user');
const {Router} =require('express');
const { validateToken } = require('../service/authentication');
const router = Router();

router.get('/signup',(req,res) =>{
     res.render('signup');
})
router.get('/signin',(req,res) =>{
  return  res.render('signin');
});
router.get('/logout',(req,res) =>{
    return res.clearCookie('token').render('signin');
});
router.post('/signup',async (req,res) =>{
    const {fullName,email,password} = req.body;
    await User.create({fullName,
        email,
        password
    });
    return res.redirect('/');
});
// route for signin
router.post('/signin',async (req,res) =>{
    const {email,password}  = req.body;
    try{
 const token = await User.matchPasswordAndGenerateToken(email,password);
 
//  console.log('Token',token);
// give these token using cookies

res.cookie('token',token).redirect('/');
}
 catch(error){
    return res.render('signin',{
        error:"Incorrect Email or Password!"
    });
 }

})

module.exports = router;