import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      // @ts-ignore
      req.user = await User.findById(decoded.id).select("-password");
    } catch (err) {
      console.log(err.message);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  next();
});

export const signedIn = asyncHandler(async (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/");
  }
});

export const signedOut = asyncHandler(async (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/user/dashboard");
  } else {
    next();
  }
});

export const reauthorize = asyncHandler(async (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(`\n\tUser authenticated: ${req.isAuthenticated()}\n`);
    const user = req.user.withoutPassword();

    res.render("auth/signin", {
      title: "Signin",
      reauthenticate: true,
      user: req.user.withoutPassword(),
    });
  } else {
    res.redirect("/auth/signin");
  }
});
