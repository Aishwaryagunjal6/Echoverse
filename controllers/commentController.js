const asyncHandler = require("express-async-handler")
const Post = require("../models/Post")
const Comment = require("../models/Comment")


exports.addComment = asyncHandler(async (req, res)=>{
  const {content} = req.body;
  const postId = req.params.id;

  //find the post
  const post = await Post.findById(postId);

  //validations
  if(!post){
    return res.render("postDetails", {
      title: "Post",
      post,
      user : req.user,
      error: "Post not found",
      success: ""
    })
  }

  if(!content){
    return res.render("postDetails", {
      title: "Post",
      post,
      user : req.user,
      error: "Comment cannot be empty!",
      success: ""
    })
  }

  //Save comment
  const comment = new Comment({
    content, 
    post : postId, 
    author : req.user._id
  })

  await comment.save();

  post.comments.push(comment._id)
  await post.save()

  console.log(post)

  //redirect
  res.redirect(`/posts/${postId}`)

})