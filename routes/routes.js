const express = require("express");
const router = express.Router();
const Allcontrolls = require("../controllers/controller");

router.get("/", Allcontrolls.homePage);
router.get("/categories",Allcontrolls.getCatgeory);
router.get("/newcat", Allcontrolls.checkAuth,Allcontrolls.newCategoryPage);
router.post("/newcat", Allcontrolls.checkAuth,Allcontrolls.newCategory);
router.get("/category/:category", Allcontrolls.allCategoriesPost);
router.get("/post/:id", Allcontrolls.postDetails);
router.post("/search", Allcontrolls.searchResults);
router.get("/create",Allcontrolls.checkAuth, Allcontrolls.getCreate);
router.post("/create", Allcontrolls.checkAuth,Allcontrolls.getNewPost);
router.get("/editpost/:id",Allcontrolls.checkAuth, Allcontrolls.getEditPage);
router.put("/editpost/:id", Allcontrolls.checkAuth,Allcontrolls.editPost);
router.delete("/postdelete/:id", Allcontrolls.checkAuth,Allcontrolls.deletePost);
router.get('/signup',Allcontrolls.checkAuth,Allcontrolls.getSignup)
router.post('/signup',Allcontrolls.checkAuth,Allcontrolls.postSignUp)
router.get('/login',Allcontrolls.getLogin)
router.post('/login',Allcontrolls.postLogin)
router.get('/logout',Allcontrolls.logout)
module.exports = router;
