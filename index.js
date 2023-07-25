const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookiePaser =  require("cookie-parser")

const Blog = require("./models/blog")

const userRoute = require("./routes/user");
const {checkAuthenticationCookie} = require("./middlewares/authentication");
const blogRoute = require("./routes/blog")

const app = express();
const PORT = 8008;

mongoose.connect('mongodb://127.0.0.1:27017/blogify')
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"));
app.set("views", path.resolve(".", "views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());
app.use(checkAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')))



app.get('/', async(req, res) => {
  const allBlogs = await Blog.find({});
  res.render('home',{
    user: req.user, 
    blogs: allBlogs
  });
});

app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.listen(PORT, () => console.log(`Server Started on PORT: ${PORT}`));

