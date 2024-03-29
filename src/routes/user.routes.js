import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshaAccessToken
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    // using multer middleware and specified the file name and their maxcount
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

//secured route
router.route("/logout").post(varifyJWT, logoutUser);
router.route('/refresh-token').post(refreshaAccessToken)

export default router;
