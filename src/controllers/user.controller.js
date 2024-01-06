import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/Apierror.js";
import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse";

const registerUser = asyncHandler(async (req, res) => {
  // step 1 -> check wheather all the fields are populted or not
  // step 2 -> check is the user is already present or not : username, email
  // step 3 -> check avatar or images are present or not -> upload them to cloudinary
  // step 4 -> user object - create entry
  // step 4 -> remove password and refresh token field from response
  // step 5 -> check for user creation
  // step 5 -> retun response

  const { fullName, email, username, password } = req.body;
  console.log(email);

  // if (fullName === ""){
  //   throw new ApiError(400, "fullname is required")
  // }
  // better code
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "") // if anyfield is empty then it will throw error
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = User.findOne({
    // checking username or email exists or not if exists then return error
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  //checking if there avatar is uploaded or not
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // time to upload the file to the cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.to,
  });

  const createdUser = await User.findById(user._id).select(
    // deselect password and refreshtoken
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "user register successfully")
  )
});

export { registerUser };
