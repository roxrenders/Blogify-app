const { Router} = require("express");
const User = require('../models/user')

const router = Router();

router.get("/signin", (req, res)=>{
    return res.render("signin");
});

router.get("/signup",(req, res)=>{
    return res.render("signup");
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        return res.cookie('token',token).redirect("/");
    } catch (error) {
        return res.render('signin',{
            error: "Incorrect email or password ",
        });
    }
});

router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect("/");
})


router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        await User.create({
            fullName,
            email,
            password,
        });
        console.log("User created successfully");
        return res.redirect("/");
    } catch (err) {
        console.error("Error creating user:", err);
        return res.redirect("/user/signup?error=1");
    }
});

module.exports = router;
