const express = require("express")
const postRoutes = express.Router();
const upload = require("../config/multer")

const {getPostForm, createPost, getPosts, getPostById} = require ("../controllers/postControllers")
const {ensureAuthenticated} = require("../middlewares/auth")

//get post form
postRoutes.get("/add", getPostForm);

//creating a new post logic
postRoutes.post("/add", ensureAuthenticated, upload.array("images", 5), createPost);  //we are passing an array of images and the number specifies how much images we can upload, at this time we can upload only 5 images


//getting all posts
postRoutes.get("/", getPosts);

//Get post by Id
postRoutes.get("/:id", getPostById)


module.exports = postRoutes