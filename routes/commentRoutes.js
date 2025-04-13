const express = require("express")
const commentRoutes = express.Router();

const {ensureAuthenticated} = require("../middlewares/auth");
const {addComment} = require("../controllers/commentController")


//add Comment
commentRoutes.post("/posts/:id/comments", ensureAuthenticated ,addComment)

module.exports = commentRoutes;