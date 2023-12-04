import express from "express";
import { signUp, login, updateProfile } from '../controller/auth-controller';
import { createPost, updatePost, deletePost, getPostDetails, getPostsByUserId, get } from '../controller/post-controller';
import { addComment, deleteComment } from "../controller/comment-controller"
import { likePost, unlikePost } from "../controller/like-controller";
import { addBookmark, removeBookmark } from "../controller/bookmark-controller";
const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.patch("/:id/updateuser", updateProfile);


router.get('/:id/posts', get);
// GET all posts for partifcular id
router.get('/:id/posts', getPostsByUserId);
// GET posts for a particular user and post ID
router.get('/:id/posts/:postId', getPostDetails);

// Posts Routes
router.post('/:id/posts', createPost);
router.patch('/:id/posts/:postId', updatePost);
router.delete('/:id/posts/:postId', deletePost);

// Comments Routes
router.post('/:id/posts/:postId/comments', addComment);
router.delete('/:id/posts/:postId/comments/:commentId', deleteComment);

// Likes Routes
router.post('/:id/posts/:postId/like', likePost);
router.delete('/:id/posts/:postId/unlike', unlikePost);

// Route to add a bookmark to a post
router.post('/:id/posts/:postId/bookmark', addBookmark);

// Route to remove a bookmark from a post
router.delete('/:id/posts/:postId/bookmark', removeBookmark);

export default router;
