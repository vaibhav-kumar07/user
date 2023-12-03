import express from "express";
import { signUp, login, updateProfile } from '../controller/auth-controller';
import { createPost, updatePost, deletePost } from '../controller/post-controller';
import { addComment, deleteComment } from "../controller/comment-controller"
import { likePost, unlikePost } from "../controller/like-controller";
const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.patch("/:id/updateuser", updateProfile);

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

export default router;
