const Category = require("../model/category");
const Post = require("../model/post");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const passport = require('passport');
require('./passport')(passport)


const checkAuth = function(req,res,next){
  if(req.isAuthenticated()){
      // to prevent caching
      res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
    next()
  }else{
    res.redirect('/login')
  }
}

const homePage = (req, res) => {

  Post.find()
    .sort({ createdAt: -1 })
    .then((results) => {
      if(req.isAuthenticated()){
        res.render("index", { title: "home", results ,loggedIn:true,username: req.user.username});
      }else{
        res.render("index", { title: "home", results ,loggedIn:false,username:''});
      }
    })
    .catch((err) => console.log(err));
};

const getCatgeory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.render("categories", { title: "categories", categories });
  } catch (error) {
    console.log(error);
  }
};

const newCategoryPage = (req, res) => {
  res.render("newcat", { title: "New-category" });
};

const newCategory = (req, res) => {
  const categoryName = req.body.category;

  const newcat = new Category({
    category: categoryName,
  });
  newcat.save();
  res.redirect("/");
};

const allCategoriesPost = async (req, res) => {
  try {
    const category = req.params.category;
    const results = await Post.find({ category: category });
    res.render("allcategories", { title: "category-post", results });
  } catch (err) {
    console.log(err);
  }
};

const postDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);
    // res.json(post)
    const otherposts = await Post.find().sort({ createdAt: -1 }).limit(3);
    if(req.isAuthenticated()){
      res.render("details", { title: "post details", post, otherposts,loggedIn:true});
    }else{
      res.render("details", { title: "post details", post, otherposts,loggedIn:false});
 
    }
    // res.json(otherposts)
  } catch (error) {
    console.log(error);
  }
};

const searchResults = (req, res) => {
  const searchText = req.body.searchpost;

  const searchResult = Post.find({
    $text: {
      $search: searchText,
      $diacriticSensitive: true,
    },
  })
    .then((searchresults) => {
      res.render("search", { title: "Search-result", searchresults });
    })
    .catch((err) => console.log(err));
};

const getCreate = async (req, res) => {
  try {
    const categories = await Category.find();
    res.render("create", { title: "create-new", categories });
  } catch (error) {
    console.log(error);
  }
};

const getNewPost = async (req, res) => {
  let theImage;
  let uploadPath;
  let imageName;

  if (!req.files || Object.keys(req.files).length === 0) {
    console.log("no files to display");
  } else {
    theImage = req.files.image;
    imageName = theImage.name;
    uploadPath = require("path").resolve("./") + "/public/" + imageName;

    theImage.mv(uploadPath, function (err) {
      if (err) {
        console.log(err);
      }
    });
  }

  try {
    const post = new Post({
      title: req.body.title,
      authorName: req.body.authorname,
      snippet: req.body.snippet,
      body: req.body.body,
      category: req.body.category,
      image: imageName,
    });
    await post.save();
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

const getEditPage = async (req, res) => {

  try {
    const id = req.params.id;
    const editpost = await Post.findById(id);
    if(req.isAuthenticated()){
      res.render("editpost", { title: "edit-post", editpost,username: req.user.username });
    
    }
  } catch (error) {
    console.log(error);
  }
};

const editPost = async (req, res) => {
  try {
    const id = req.params.id;
    const Postedit = await Post.findByIdAndUpdate(id);
    let theImage;
    let uploadPath;
    let imageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("no files to display");
    } else {
      theImage = req.files.image;
      imageName = theImage.name;
      uploadPath = require("path").resolve("./") + "/public/" + imageName;

      theImage.mv(uploadPath, function (err) {
        if (err) {
          console.log(err);
        }
      });
    }

    Postedit.title = req.body.title;
    Postedit.snippet = req.body.snippet;
    Postedit.body = req.body.body;
    Postedit.authorName = req.body.authorname;
    Postedit.image = imageName;
    Postedit.category = req.body.category;

    await Postedit.save();
    res.redirect(`/post/${Postedit._id}`);
  } catch (error) {
    console.log(error);
  }
};

const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const postDelete = await Post.findByIdAndDelete(id);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};
const getSignup = (req, res) => {
  res.render("signup", { title: "signup" });
};

const postSignUp = (req, res) => {
  const { uname, email, psw, cpsw } = req.body;
  if (!uname || !email || !psw || !cpsw) {
    res.render("signup", { title: "signup", err: "Fields cannot be empty" });
  } else if (psw.length < 8) {
    res.render("signup", { title: "signup", err: "Password is too short" });
  } else if (cpsw != psw) {
    res.render("signup", { title: "signup", err: "Password does not match" });
  } else {
    User.findOne(
      { $or: [{ email: email }, { username: uname }] },
      function (err, user) {
        if (err) {
          throw err;
        }
        if (user) {
          res.render("signup", { title: "signup", err: "User already exist" });
        } else {
          bcrypt.genSalt(12, function (err, salt) {
            if (err) { 
              throw err;
            }
            if (salt) {
              bcrypt.hash(psw, salt, function (err, hash) {
                if (err) {
                  throw err;
                }
                if (hash) {
                  const test = new User({
                    username:uname,
                    email:email,
                    password:hash
                  });
                  test.save((err,result)=>{
                    if(err){
                      throw err
                    }
                    if(result){
                      res.redirect('login')
                    }

                  })
                }
              });
            }
          });
        }
      }
    );
  }
};

const getLogin = (req,res)=>{
  res.render("Login", { title: "Login-page" });

}
const postLogin = (req,res,next)=>{
  passport.authenticate('local',{
    failureRedirect: '/login',
    successRedirect: '/',
    failureFlash: true

  })(req, res, next)
}
const logout = (req,res,next)=>{
  req.logout(function(err) {
      if (err) { return next(err); }
      req.session.destroy(function(err){
          res.redirect('/');
      })
    });

}

module.exports = {
  homePage,
  getCatgeory,
  allCategoriesPost,
  postDetails,
  searchResults,
  getCreate,
  getNewPost,
  getEditPage,
  editPost,
  deletePost,
  newCategoryPage,
  newCategory,
  getSignup,
  postSignUp,
  getLogin,
  postLogin,
  checkAuth,
  logout
};
