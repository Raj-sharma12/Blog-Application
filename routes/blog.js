const Router = require('express');
const router = Router();
const path = require('path');
const multer = require('multer');
const Blog = require('../models/blog');
const Comment  =  require('../models/comments');

// const storage = multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,path.resolve(`./public/uploads/`));
//     },
//     filename:function(req,file,cb){
//         const fileName = `${Date.now()} - ${file.originalname}}`;
//         cb(null,fileName);
//     }
// });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./public/uploads/`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + (file.originalname)); // Keep the original extension
    }
});
const upload = multer({storage});


router.get('/add-new',(req,res) =>{
return res.render('addBlog',{
    user:req.user,
});
})
// post route for post a blog to server  use /blog route
router.post('/', upload.single('coverImage') ,async (req,res) =>{
    // create a Blog
    const {title,body} = req.body;
   const blog = await  Blog.create({
    title,
    body,
    createdBy:req.user._id,
    coverImageURL:`/uploads/${req.file.filename}`,
   });
   return  res.redirect(`/blog/${blog._id}`);
});

// create a dyanamic route for blog id
router.get('/:id',async (req,res) =>{
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    // find all comment regarding this blog_id
   const comments = await Comment.find({ blogId:req.params.id }).populate('createdBy');
    console.log(comments);
    
    return res.render('blog',{
        user:req.user,
        blog,
        comments,
    })
})


// route for comment
router.post('/comment/:blogId',async (req,res) => {
const comment = await Comment.create({
    content:req.body.content,
    blogId:req.params.blogId,
    createdBy:req.user._id,
});
return res.redirect(`/blog/${req.params.blogId}`)
});
module.exports =  router;