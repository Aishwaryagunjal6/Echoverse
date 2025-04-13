const asyncHandler = require("express-async-handler")
const Post = require("../models/Post")
const File = require("../models/File")
const cloudinary =  require("../config/cloudinary");


exports.getPostForm = asyncHandler((req, res)=>{
  res.render("newPost",{
    title:"Create Post",
    user: req.user,
    success: "",
    error: ""
  });

})

//creating new post
exports.createPost = asyncHandler(async (req, res)=>{
  const {title, content} = req.body;
  
  //validation for file upload
  // if(!req.files || req.files.length === 0){
  //   return res.render("newPost",{
  //     title:"Create Post",
  //     user: req.user,
  //     error: "Atleast one image is required!",
  //     success: ""
  //   })
  // }

  const images = await Promise.all(req.files.map(async(file)=>{
    //save the image into our database
    const newFile = new File({
      url: file.path,
      public_id: file.filename,
      uploaded_by: req.user._id
    })
    await newFile.save()
    console.log(newFile)
    return{
      url : newFile.url,
      public_id: newFile.public_id
    }
  }))

  const newPost = new Post({
    title,
    content,
    author: req.user._id,
    images
  })
  await newPost.save();
  res.render("newPost",{
    title: "Create Post",
    user: req.user,
    success: "Post Created Successfully",
    error: ""
  })
})


//Get all posts
 exports.getPosts = asyncHandler( async(req, res)=>{
  const posts = await Post.find().populate("author", "username")
  res.render("posts", {
    title: "Posts",
    posts,
    user: req.user,
    error: "",
    success: ""
  })
 })

 //Get post by Id

 exports.getPostById = asyncHandler(async (req, res)=>{
    const post = await Post.findById(req.params.id).populate("author", "username").populate({
      path:"comments",
      populate:{
        path: "author",
        model: "User",
        select: "username"
      }
    });
    res.render("postDetails", {
      title:"Post",
      post,
      user: req.user,
      success: "",
      error: ""
    })
 })


//  Get edit post form

exports.getEditPostForm = asyncHandler(async(req, res)=>{
  const post = await Post.findById(req.params.id);
  if(!post){
    res.render("postDetails", {
      title: "Edit Post",
      user: req.user,
      post,
      error: "Post doesn't exists!",
      success : ""
    })
  }
  res.render("editPost", {
    title: "Edit Post",
    user: req.user,
    post,
    error: "",
    success : ""
  })
})

//Update post

exports.updatePost = asyncHandler(async(req, res)=>{
  const {title, content} = req.body;
  const post = await Post.findById(req.params.id);
  if(!post){
    return res.render("postDetails", {
      title : "Post",
      post,
      user : req.user,
      error : "Post Not Found",
      success : ""
    })
  }

  //check if author is not updating
  if(post?.author.toString() !== req.user._id.toString()){
      return res.render("postDetails", {
        post,
        title: "Post",
        user: req.user,
        error: "You are not authorized to edit this post",
        success: ""
      })
  }

  post.title = title || post.title;
  post.content = content || post.content;

  if(req.files){  //upload img files to cloudinary
    //remove all images
    await Promise.all(post.images.map(async(image)=>{
      await cloudinary.uploader.destroy(image.public_id);
    }))
  }

  post.images = await Promise.all(
    req.files.map(async (file)=>{
      const newFile = new File({
        url: file.path,
        public_id : file.filename,
        uploaded_by: req.user._id
      })
      await newFile.save();
      return {
        url : newFile.url,
        public_id : newFile.public_id
      }
    })
  )

  await post.save();
  res.redirect(`/posts/${post._id}`)
})