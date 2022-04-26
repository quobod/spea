import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import { create } from "../custom_modules/captcha.js";

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
    res.redirect("/user");
  } else {
    next();
  }
});

export const reauthorize = asyncHandler(async (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(`\n\tUser authenticated: ${req.isAuthenticated()}\n`);
    const user = req.user.withoutPassword();

    const captchaUrl = "../captcha.jpg";
    const captchaId = "captcha";
    const captchaFieldName = "captcha";
    const captcha = create({ cookie: captchaId });

    res.render("auth/signin", {
      title: "Signin",
      reauthenticate: true,
      user: req.user.withoutPassword(),
      csrfToken: req.csrfToken,
    });
  } else {
    res.redirect("/auth/signin");
  }
});
