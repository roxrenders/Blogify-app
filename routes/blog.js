// blog.js

const { Router } = require("express");
const multer = require('multer');
const path = require("path");
const router = Router();
const Blog = require("../models/blog");
const { checkAuthenticationCookie } = require("../middlewares/authentication");
const Comment = require("../models/comment");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`))
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`
    cb(null, filename)
  }
})

const upload = multer({ storage: storage })

router.get('/add-new', (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.get('/:id', async(req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");

  const comments = await Comment.find({blogId: req.params.id}).populate("createdBy");
  
  res.render('blog',{
    user: req.user,  
    blog,
    comments
  });
});

router.post("/comment/:blogId", async(req, res)=>{
  const com = await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id
  });
  return res.redirect(`/blog/${req.params.blogId}`);
})

router.post('/', checkAuthenticationCookie("token"), upload.single('coverImage'), async (req, res) => {
  if (!req.user) {
    return res.status(401).send("User not authenticated.");
  }
  
  const { title, body } = req.body;
  const coverImageURL = req.file.path; 

  try {
    const blog = await Blog.create({ title, body, coverImageURL:`/uploads/${req.file.filename}`, createdBy: req.user._id });
    console.log("coverImageURL")
    res.redirect(`/blog/${blog._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating blog post.");
  }
});

module.exports = router;
