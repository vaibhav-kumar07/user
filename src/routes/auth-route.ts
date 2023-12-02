import express from "express";
import { signUp, login, updateProfile } from '../controller/auth-controller';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.patch("/:id/updateuser", updateProfile)

export default router;
